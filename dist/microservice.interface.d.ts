import { InjectionToken } from '@rxdi/core';
export interface MicroserviceInterface {
    name: string;
    link: string;
}
export declare type AFTER_MIDDLEWARE = Middleware;
export declare type BEFORE_MIDDLEWARE = Middleware;
export interface MiddlewareOptions {
    context: Object;
    operationName: string;
    variables: Object;
    query: string;
    microservice: MicroserviceInterface;
    method: string | 'POST' | 'GET';
    headers: {
        [key: string]: string;
    };
}
export declare type Middleware = (options: MiddlewareOptions) => Promise<MiddlewareOptions>;
export declare type MiddlewareAfter = (res: any, options: MiddlewareOptions) => Promise<Object>;
export declare const BEFORE_MIDDLEWARE: InjectionToken<Middleware>;
export declare const AFTER_MIDDLEWARE: InjectionToken<Middleware>;
