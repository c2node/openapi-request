import {GenerateServiceProps} from './types';
import * as fs from "fs";
import axios from "axios";
import * as converter from 'swagger2openapi';
import {OpenAPI3} from "openapi-typescript/dist/types";
import {GeneratorService} from "./generator";
import * as path from "path";
import * as process from "process";

export const DefaultTemplateFolder = path.join(__dirname, "../", 'templates');

/**
 * 获取api文档
 * @param schemaPath
 */
async function getApiDocument(schemaPath: string) {
    if (schemaPath.startsWith('http')) {
        try {
            return await axios.request({url: schemaPath, responseType: "json"}).then(res => res.data);
        } catch (error) {
            throw new Error('fetch '+schemaPath+' error:'+error.message);
        }
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
        converter.convertObj(document, {mediatype: false}, (err, options) => {
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

export async function generateRequest({
                                          schemaPath,
                                          requestImport,
                                          requestFnName = 'axios.request',
                                          requestParams,
                                          requestFnOtherParams = [],
                                          templatesFolder,
                                          serversPath,
                                          ...options
                                      }: GenerateServiceProps) {
    const openAPI = await getOpenApi3Document(schemaPath);
    const generator = new GeneratorService(openAPI, {
        serversPath: serversPath ? serversPath : process.cwd(),
        requestImport: getImportStatement(requestImport),
        requestFnName,
        requestParams: requestParams ?? {
            path: true,
            query: true,
            header: true,
            cookie: true
        },
        requestFnOtherParams,
        templatesFolder: templatesFolder ? templatesFolder : DefaultTemplateFolder,
        hook: {},
        ...options,
    });
    await generator.generator();
}
