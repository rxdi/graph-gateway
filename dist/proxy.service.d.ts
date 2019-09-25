import { MicroserviceInterface } from './microservice.interface';
import { GraphQLSchema } from 'graphql';
export declare class ProxyService {
    private microservices;
    constructor(microservices: MicroserviceInterface[]);
    getSchemaIntrospection(): Promise<GraphQLSchema>;
    private getIntrospectSchema;
}
