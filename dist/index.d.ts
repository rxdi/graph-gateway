import { ModuleWithServices } from '@rxdi/core';
import { MicroserviceInterface } from './microservice.interface';
export declare class MicroserviceModule {
    static forRoot(microservices: MicroserviceInterface[], config?: {
        authorization?: Function;
    }): ModuleWithServices;
}
export * from './proxy.service';
export * from './microservice.interface';
