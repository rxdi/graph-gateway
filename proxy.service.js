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
const fetch = require("node-fetch");
let ProxyService = class ProxyService {
    constructor(microservices, configAuth) {
        this.microservices = microservices;
        this.configAuth = configAuth;
    }
    getSchemaIntrospection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mergeSchemas(yield Promise.all(this.microservices.map(ep => {
                console.log(`Microservice: ${ep.name} loaded!`);
                return this.getIntrospectSchema(ep);
            })));
        });
    }
    mergeSchemas(allSchemas) {
        return graphql_tools_1.mergeSchemas({ schemas: allSchemas });
    }
    getIntrospectSchema(microservice) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = { authorization: '' };
            if (this.configAuth.authorization) {
                const Authorization = core_1.Container.get(this.configAuth.authorization);
                headers.authorization = Authorization.sign({
                    email: microservice.name,
                    id: -1,
                    scope: ['ADMIN']
                });
            }
            const makeDatabaseServiceLink = () => apollo_link_http_1.createHttpLink({ uri: microservice.link, fetch, headers });
            return graphql_tools_1.makeRemoteExecutableSchema({
                schema: yield graphql_tools_1.introspectSchema(makeDatabaseServiceLink()),
                link: makeDatabaseServiceLink()
            });
        });
    }
};
ProxyService = __decorate([
    core_1.Service(),
    __param(0, core_1.Inject('gapi-microservice-config')),
    __param(1, core_1.Inject('gapi-microservice-config-auth')),
    __metadata("design:paramtypes", [Array, Object])
], ProxyService);
exports.ProxyService = ProxyService;
