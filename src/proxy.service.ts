import { Service, Inject, Container } from '@rxdi/core';
import {
  mergeSchemas,
  introspectSchema,
  makeRemoteExecutableSchema
} from 'graphql-tools';
import { createHttpLink } from 'apollo-link-http';
import {
  MicroserviceInterface,
  BEFORE_MIDDLEWARE,
  AFTER_MIDDLEWARE,
  Middleware,
  MiddlewareAfter
} from './microservice.interface';
import fetch = require('node-fetch');
import { GraphQLSchema } from 'graphql';
import { print } from 'graphql';

@Service()
export class ProxyService {
  constructor(
    @Inject('gapi-microservice-config')
    private microservices: MicroserviceInterface[]
  ) {}

  public async getSchemaIntrospection(microservices?: MicroserviceInterface[]): Promise<GraphQLSchema> {
    const schemas = await Promise.all(
      (microservices || this.microservices).map(async ep => {
        console.log(`Microservice: ${ep.name} loaded!`);
        return {
          ...ep,
          schema: await this.getIntrospectSchema(ep)
        };
      })
    );
    return mergeSchemas({
      schemas: schemas.map(res => res.schema)
    });
  }

  private async getIntrospectSchema(
    microservice: MicroserviceInterface
  ): Promise<GraphQLSchema> {
    const link = createHttpLink({ uri: microservice.link, fetch });
    return makeRemoteExecutableSchema({
      schema: await introspectSchema(link),
      link,
      async fetcher({
        query: queryDocument,
        variables,
        operationName,
        context: { graphqlContext }
      }) {
        let beforeMiddleware: Middleware = r => Promise.resolve(r);
        let afterMiddlewares: MiddlewareAfter[] = [];
        try {
          beforeMiddleware = Container.get(BEFORE_MIDDLEWARE);
        } catch (e) {}
        try {
          afterMiddlewares = Container.getMany(AFTER_MIDDLEWARE);
        } catch (e) {}
        const query = print(queryDocument);
        let middlewareOptions = {
          context: graphqlContext,
          operationName,
          variables,
          method: 'POST',
          query,
          headers: graphqlContext['headers'] || {
            'Content-Type': 'application/json'
          },
          microservice
        };

        middlewareOptions = await beforeMiddleware(middlewareOptions);
        const fetchResult = await fetch(middlewareOptions.microservice.link, {
          method: middlewareOptions.method,
          headers: middlewareOptions.headers,
          body: JSON.stringify({ query, variables, operationName })
        });
        let res = await fetchResult.json();
        if (afterMiddlewares.length) {
          for (const middleware of afterMiddlewares) {
            res = await middleware(res, middlewareOptions);
          }
        }
        return res;
      }
    });
  }
}
