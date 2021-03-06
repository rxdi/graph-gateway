"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var MicroserviceModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const proxy_service_1 = require("./proxy.service");
let MicroserviceModule = MicroserviceModule_1 = class MicroserviceModule {
    static forRoot(microservices, config) {
        if (!config) {
            config = { authorization: null };
        }
        return {
            module: MicroserviceModule_1,
            services: [
                proxy_service_1.ProxyService,
                {
                    provide: 'gapi-microservice-config-auth',
                    useValue: config
                },
                {
                    provide: 'gapi-microservice-config',
                    useValue: microservices
                },
                {
                    provide: 'gapi-custom-schema-definition',
                    lazy: true,
                    deps: [proxy_service_1.ProxyService],
                    useFactory: (proxyService) => __awaiter(this, void 0, void 0, function* () {
                        return yield proxyService.getSchemaIntrospection();
                    })
                }
            ]
        };
    }
};
MicroserviceModule = MicroserviceModule_1 = __decorate([
    core_1.Module()
], MicroserviceModule);
exports.MicroserviceModule = MicroserviceModule;
__export(require("./microservice.interface"));
__export(require("./proxy.service"));
