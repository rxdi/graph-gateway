# @rxdi/graph-gatway

Create easy `graph` gatway from existing Graphql endpoints

## Features

- Merge multiple Remote graphql servers to single schema
- Microservice architecture


## Installation

```bash
npm i -g @rxdi/graph-gatway
```

## Usage

```typescript
import { Module, CoreModule, Bootstrap } from '@gapi/core';
import { GraphGatewayModule } from '@rxdi/graph-gatway';

@Module({
  imports: [
    GraphGatewayModule.forRoot([
      {
        link: 'http://localhost:9000/graphql',
        name: 'Graph1'
      },
      {
        link: 'http://localhost:9001/graphql',
        name: 'Graph2'
      }
    ]),
    CoreModule.forRoot(),
  ]
})
export class AppModule {}

Bootstrap(AppModule).subscribe(() => console.log('Started'));

```