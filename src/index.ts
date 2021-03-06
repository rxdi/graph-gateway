import { Module, ModuleWithServices } from '@rxdi/core';
import { ProxyService } from './proxy.service';
import { MicroserviceInterface, Middleware } from './microservice.interface';

@Module()
export class MicroserviceModule {
  static forRoot(
    microservices: MicroserviceInterface[],
    config?: { authorization?: Function }
  ): ModuleWithServices {
    if (!config) {
      config = { authorization: null };
    }
    return {
      module: MicroserviceModule,
      services: [
        ProxyService,
        {
          provide: 'gapi-microservice-config-auth',
          useValue: config
        },
        {
          provide: 'gapi-microservice-config',
          useValue: microservices
        },
        {
          provide: 'gapi-custom-schema-definition',
          lazy: true,
          deps: [ProxyService],
          useFactory: async (proxyService: ProxyService) => {
            return await proxyService.getSchemaIntrospection();
          }
        }
      ]
    };
  }
}

export * from './microservice.interface';
export * from './proxy.service';
