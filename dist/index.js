"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateService = void 0;
const fs = require("fs");
const axios_1 = require("axios");
const converter = require("swagger2openapi");
const service_1 = require("./generator/service");
const path = require("path");
const process = require("process");
async function getApiDocument(schemaPath) {
    if (schemaPath.startsWith('http')) {
        try {
            return await axios_1.default.request({ url: schemaPath, responseType: "json" }).then(res => res.data);
        }
        catch (error) {
            console.error('fetch openapi error:', error);
        }
        return null;
    }
    const schemaJson = await fs.promises.readFile(schemaPath, { encoding: "utf-8" });
    return JSON.parse(schemaJson);
}
async function getOpenApi3Document(schemaPath) {
    const document = await getApiDocument(schemaPath);
    if (!document.swagger) {
        return document;
    }
    return new Promise((resolve, reject) => {
        converter.convertObj(document, {}, (err, options) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(options.openapi);
        });
    });
}
const getImportStatement = (requestImport) => {
    if (requestImport && requestImport.startsWith('import')) {
        return requestImport;
    }
    if (requestImport) {
        return `import axios from '${requestImport}'`;
    }
    return "import axios from \"axios\"";
};
async function generateService({ schemaPath, requestImport, requestFnName = 'axios.request', templatesFolder, serversPath, ...options }) {
    const openAPI = await getOpenApi3Document(schemaPath);
    const generator = new service_1.GeneratorService(openAPI, {
        serversPath: serversPath ? serversPath : process.cwd(),
        requestImport: getImportStatement(requestImport),
        requestFnName,
        templatesFolder: templatesFolder ? templatesFolder : path.join(__dirname, "../", 'templates'),
        hook: {},
        ...options,
    });
    await generator.generator();
}
exports.generateService = generateService;