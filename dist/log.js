"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log = (...rest) => console.log(`[openapi-to-service]: ${rest.join('\n')}`);
exports.default = Log;
