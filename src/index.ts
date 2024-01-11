import {GenerateServiceProps} from './types';
import * as fs from "fs";
import axios from "axios";
import * as converter from 'swagger2openapi';
import {OpenAPI3} from "openapi-typescript/dist/types";
import {GeneratorService} from "./generator";
import * as path from "path";
import Log from "./log";
import * as process from "process";

/**
 * 获取api文档
 * @param schemaPath
 */
async function getApiDocument(schemaPath: string) {
    if (schemaPath.startsWith('http')) {
        try {
            return await axios.request({url: schemaPath, responseType: "json"}).then(res => res.data);
        } catch (error) {
            console.error('fetch openapi error:', error);
        }
        return null;
    }
    const schemaJson = await fs.promises.readFile(schemaPath, {encoding: "utf-8"});
    return JSON.parse(schemaJson);
}

/**
 * 获取openapi3 文档
 * @param schemaPath
 */
async function getOpenApi3Document(schemaPath: string): Promise<OpenAPI3> {
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
            resolve(options.openapi as OpenAPI3);
        });
    });
}

// 导入请求类
const getImportStatement = (requestImport: string) => {
    if (requestImport && requestImport.startsWith('import')) {
        return requestImport;
    }
    if (requestImport) {
        return `import axios from '${requestImport}'`;
    }
    return "import axios from \"axios\"";
};

export async function generateService({
                                          schemaPath,
                                          requestImport,
                                          requestFunction = 'axios.request',
                                          templatesFolder = path.join(__dirname, 'templates'),
                                          serversPath = process.cwd(),
                                          ...options
                                      }: GenerateServiceProps) {
    const openAPI = await getOpenApi3Document(schemaPath);
    const generator = new GeneratorService(openAPI, {
        templatesFolder,
        serversPath,
        requestImport: getImportStatement(requestImport),
        requestFunction,
        hook: {},
        ...options,
    });
    await generator.generator();
}
