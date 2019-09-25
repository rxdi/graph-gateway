import { Service, Inject, Container } from '@rxdi/core';
import {
  mergeSchemas,
  introspectSchema,
  makeRemoteExecutableSchema
} from 'graphql-tools';
import { createHttpLink } from 'apollo-link-http';
import { MicroserviceInterface } from './microservice.interface';
import fetch = require('node-fetch');
import { GraphQLSchema } from 'graphql';
import { print } from 'graphql';

@Service()
export class ProxyService {
  constructor(
    @Inject('gapi-microservice-config')
    private microservices: MicroserviceInterface[]
  ) {}

  public async getSchemaIntrospection(): Promise<GraphQLSchema> {
    return mergeSchemas({
      schemas: await Promise.all(
        this.microservices.map(ep => {
          console.log(`Microservice: ${ep.name} loaded!`);
          return this.getIntrospectSchema(ep);
        })
      )
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
        const query = print(queryDocument);
        const fetchResult = await fetch(microservice.link, {
          method: 'POST',
          headers: graphqlContext['headers'] || {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query, variables, operationName })
        });
        return fetchResult.json();
      }
    });
  }
}
