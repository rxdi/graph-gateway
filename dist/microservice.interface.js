"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
exports.BEFORE_MIDDLEWARE = new core_1.InjectionToken('graph-gateway-before-middleware-function-token');
exports.AFTER_MIDDLEWARE = new core_1.InjectionToken('graph-gateway-after-middleware-function-token');
