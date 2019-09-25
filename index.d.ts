import { ModuleWithServices } from '@rxdi/core';
import { MicroserviceInterface } from './microservice.interface';
export declare class MicroserviceModule {
    static forRoot(microservices: MicroserviceInterface[], config?: {
        authorization?: Function;
    }): ModuleWithServices;
}
export * from './microservice.interface';
export * from './proxy.service';
