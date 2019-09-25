import { MicroserviceInterface } from './microservice.interface';
import { GraphQLSchema } from 'graphql';
export declare class ProxyService {
    private microservices;
    private configAuth;
    constructor(microservices: MicroserviceInterface[], configAuth: {
        authorization?: Function;
    });
    getSchemaIntrospection(): Promise<GraphQLSchema>;
    private mergeSchemas;
    private getIntrospectSchema;
}
