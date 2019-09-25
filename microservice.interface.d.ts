import { InjectionToken } from '@rxdi/core';
export interface MicroserviceInterface {
    name: string;
    link: string;
}
export declare type AFTER_MIDDLEWARE = Middleware;
export declare type BEFORE_MIDDLEWARE = Middleware;
export interface MiddlewareOptions {
    context: any;
    operationName: any;
    variables: any;
    query: any;
    microservice: any;
    method: any;
    headers: any;
}
export declare type Middleware = (options: MiddlewareOptions) => MiddlewareOptions;
export declare type MiddlewareAfter = (res: any, options: MiddlewareOptions) => Object;
export declare const BEFORE_MIDDLEWARE: InjectionToken<Middleware>;
export declare const AFTER_MIDDLEWARE: InjectionToken<Middleware>;
