import { MicroserviceInterface } from './microservice.interface';
import { GraphQLSchema } from 'graphql';
export declare class ProxyService {
    private microservices;
    constructor(microservices: MicroserviceInterface[]);
    getSchemaIntrospection(microservices?: MicroserviceInterface[]): Promise<GraphQLSchema>;
    private getIntrospectSchema;
}
