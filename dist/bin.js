"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
function main() {
    const args = process.argv.splice(2);
    if (args.length < 2) {
        console.log("openapi-to-service schemaPath serversPath");
    }
    else {
        const [schemaPath, serversPath] = args;
        (0, index_1.generateService)({
            schemaPath,
            serversPath,
        }).then(res => {
            console.log("[openapi-to-service] " + schemaPath + " ok");
        });
    }
}
process.nextTick(main);
