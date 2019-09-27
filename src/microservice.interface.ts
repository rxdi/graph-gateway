import { InjectionToken } from '@rxdi/core';

export interface MicroserviceInterface {
  name: string;
  link: string;
}
export type AFTER_MIDDLEWARE = Middleware;
export type BEFORE_MIDDLEWARE = Middleware;
export interface MiddlewareOptions {
  context: Object;
  operationName: string;
  variables: Object;
  query: string;
  microservice: MicroserviceInterface;
  method: string | 'POST' | 'GET';
  headers: { [key: string]: string };
}
export type Middleware = (options: MiddlewareOptions) => Promise<MiddlewareOptions>;
export type MiddlewareAfter = (res, options: MiddlewareOptions) => Promise<Object>;

export const BEFORE_MIDDLEWARE = new InjectionToken<Middleware>(
  'graph-gateway-before-middleware-function-token'
);
export const AFTER_MIDDLEWARE = new InjectionToken<Middleware>(
  'graph-gateway-after-middleware-function-token'
);
