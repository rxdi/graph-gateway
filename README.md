DEPRECATED IN FAVOR OF https://github.com/Stradivario/gapi/tree/master/packages/federation
This can be used as a reference on how to create `graphql schema stiching` aka old federation.

# @rxdi/graph-gateway

Create easy `graph` gatway from existing Graphql endpoints

## Features

- Merge multiple Remote graphql servers to single schema
- Microservice architecture


## Installation

```bash
npm i -g @rxdi/graph-gateway
```

## Usage

```typescript
import {
  Module,
  CoreModule,
  Bootstrap,
  ON_REQUEST_HANDLER,
  GRAPHQL_PLUGIN_CONFIG
} from '@gapi/core';
import {
  MicroserviceModule,
  AFTER_MIDDLEWARE,
  BEFORE_MIDDLEWARE,
  MiddlewareOptions
} from '@rxdi/graph-gateway';
import { ResponseToolkit } from 'hapi';

@Module({
  providers: [
    {
      provide: ON_REQUEST_HANDLER,
      deps: [GRAPHQL_PLUGIN_CONFIG],
      useFactory: (config: GRAPHQL_PLUGIN_CONFIG) => async (
        next,
        request: Request,
        h: ResponseToolkit,
        err: Error
      ) => {
        config.graphqlOptions.context = config.graphqlOptions.context || {};
        config.graphqlOptions.context['headers'] = request.headers;
        console.log('On request handler');
        return next();
      }
    },
    {
      provide: BEFORE_MIDDLEWARE,
      useFactory: () => (options: MiddlewareOptions) => {
        console.log('Before Middleware', options.headers);
        return options;
      }
    },
    // Notice how after middleware has multi injection so you can specify which values to return
    // This behaviour is valid only for After middleware
    {
      provide: AFTER_MIDDLEWARE,
      useFactory: () => (res, options: MiddlewareOptions) => {
        if (res.statusCode && res.statusCode !== 200) {
          throw new Error('Unauthorized');
        }
        console.log('RES1', res);
        return res;
      }
    },
    {
      provide: AFTER_MIDDLEWARE,
      useFactory: () => (res, options: MiddlewareOptions) => {
        console.log('RES2', res);
        return res;
      }
    }
  ],
  imports: [
    MicroserviceModule.forRoot([
      {
        link: 'http://localhost:9000/graphql',
        name: 'Main'
      },
      {
        link: 'http://localhost:9001/graphql',
        name: 'Main2'
      }
    ]),
    CoreModule.forRoot()
  ]
})
export class AppModule {}

Bootstrap(AppModule).subscribe(() => console.log('Started'));

```


## Middleware options
```typescript
export interface MicroserviceInterface {
  name: string;
  link: string;
}
export interface MiddlewareOptions {
  context: Object;
  operationName: string;
  variables: Object;
  query: string;
  microservice: MicroserviceInterface;
  method: string | 'POST' | 'GET';
  headers: { [key: string]: string };
}
```
