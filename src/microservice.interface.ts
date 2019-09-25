import { InjectionToken } from '@rxdi/core';

export interface MicroserviceInterface {
  name: string;
  link: string;
}
export type AFTER_MIDDLEWARE = Middleware;
export type BEFORE_MIDDLEWARE = Middleware;
export interface MiddlewareOptions {
  context;
  operationName;
  variables;
  query;
  microservice;
  method;
  headers;
}
export type Middleware = (options: MiddlewareOptions) => MiddlewareOptions;
export type MiddlewareAfter = (res, options: MiddlewareOptions) => Object;

export const BEFORE_MIDDLEWARE = new InjectionToken<Middleware>(
  'graph-gateway-before-middleware-function-token'
);
export const AFTER_MIDDLEWARE = new InjectionToken<Middleware>(
  'graph-gateway-after-middleware-function-token'
);
