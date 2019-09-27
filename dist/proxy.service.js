"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const graphql_tools_1 = require("graphql-tools");
const apollo_link_http_1 = require("apollo-link-http");
const microservice_interface_1 = require("./microservice.interface");
const fetch = require("node-fetch");
const graphql_1 = require("graphql");
let ProxyService = class ProxyService {
    constructor(microservices) {
        this.microservices = microservices;
    }
    getSchemaIntrospection(microservices) {
        return __awaiter(this, void 0, void 0, function* () {
            const schemas = yield Promise.all((microservices || this.microservices).map((ep) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Microservice: ${ep.name} loaded!`);
                return Object.assign({}, ep, { schema: yield this.getIntrospectSchema(ep) });
            })));
            core_1.Container.reset('schemas');
            core_1.Container.remove('schemas');
            core_1.Container.set('schemas', schemas);
            return graphql_tools_1.mergeSchemas({
                schemas: schemas.map(res => res.schema)
            });
        });
    }
    getIntrospectSchema(microservice) {
        return __awaiter(this, void 0, void 0, function* () {
            const link = apollo_link_http_1.createHttpLink({ uri: microservice.link, fetch });
            return graphql_tools_1.makeRemoteExecutableSchema({
                schema: yield graphql_tools_1.introspectSchema(link),
                link,
                fetcher({ query: queryDocument, variables, operationName, context: { graphqlContext } }) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let beforeMiddleware = r => Promise.resolve(r);
                        let afterMiddlewares = [];
                        try {
                            beforeMiddleware = core_1.Container.get(microservice_interface_1.BEFORE_MIDDLEWARE);
                        }
                        catch (e) { }
                        try {
                            afterMiddlewares = core_1.Container.getMany(microservice_interface_1.AFTER_MIDDLEWARE);
                        }
                        catch (e) { }
                        const query = graphql_1.print(queryDocument);
                        let middlewareOptions = {
                            context: graphqlContext,
                            operationName,
                            variables,
                            method: 'POST',
                            query,
                            headers: graphqlContext['headers'] || {
                                'Content-Type': 'application/json'
                            },
                            microservice
                        };
                        middlewareOptions = yield beforeMiddleware(middlewareOptions);
                        const fetchResult = yield fetch(middlewareOptions.microservice.link, {
                            method: middlewareOptions.method,
                            headers: middlewareOptions.headers,
                            body: JSON.stringify({ query, variables, operationName })
                        });
                        let res = yield fetchResult.json();
                        if (afterMiddlewares.length) {
                            for (const middleware of afterMiddlewares) {
                                res = yield middleware(res, middlewareOptions);
                            }
                        }
                        return res;
                    });
                }
            });
        });
    }
};
ProxyService = __decorate([
    core_1.Service(),
    __param(0, core_1.Inject('gapi-microservice-config')),
    __metadata("design:paramtypes", [Array])
], ProxyService);
exports.ProxyService = ProxyService;
