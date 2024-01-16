"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log = (...rest) => console.log(`[openapi-request]: ${rest.join('\n')}`);
exports.default = Log;
