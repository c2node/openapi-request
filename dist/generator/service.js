"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorService = void 0;
const fs = require("fs");
const path = require("path");
const util_1 = require("util");
const openapiTS = require("openapi-typescript");
const ejs = require("ejs");
const utils_1 = require("../utils");
class GeneratorService {
    openApi;
    config;
    templateEngine;
    constructor(openApi, config) {
        this.openApi = openApi;
        this.config = config;
    }
    getTemplateEngine() {
        if (!this.templateEngine) {
            const readFile = (filename) => fs.promises.readFile(path.join(this.config.templatesFolder, filename + '.ejs'), { encoding: "utf-8" });
            this.templateEngine = async (name, context) => {
                const template = await readFile(name);
                const temp = ejs.compile(template);
                return temp(context);
            };
        }
        return this.templateEngine;
    }
    async renderTemplateSave(fileName, type, params) {
        try {
            const template = this.getTemplateEngine();
            const res = await template(type, params);
            await fs.promises.writeFile(fileName, res);
        }
        catch (error) {
            console.error('[openapi-to-service] file gen fail:', fileName, 'type:', type);
            throw error;
        }
    }
    get apiPaths() {
        return this.openApi.paths ?? {};
    }
    async clearDir(dirPath) {
        const files = await fs.promises.readdir(dirPath, { encoding: "utf-8" });
        for (const filename of files) {
            const filePath = path.join(dirPath, filename);
            const stat = await fs.promises.stat(filePath);
            if (stat.isDirectory()) {
                await this.clearDir(filePath);
                await fs.promises.unlink(filePath);
            }
            else {
                await fs.promises.unlink(filePath);
            }
        }
    }
    async getOutputDir() {
        let outputDir = this.config.serversPath;
        if (this.config.projectName) {
            outputDir = path.join(outputDir, this.config.projectName);
        }
        let isExists = false;
        if (fs.existsSync(outputDir)) {
            const stat = await fs.promises.stat(outputDir);
            if (stat.isDirectory()) {
                await this.clearDir(outputDir);
                isExists = true;
            }
            else {
                console.error('[openapi-to-service] directory create fail:', outputDir);
            }
        }
        if (!isExists) {
            await fs.promises.mkdir(outputDir, { recursive: true });
        }
        return outputDir;
    }
    getMethodMetadata(path, method) {
        const paths = this.apiPaths;
        if (paths[path] && paths[path][method]) {
            const definition = paths[path][method];
            const { parameters = [], requestBody } = definition;
            const params = ['path', 'query'].filter(type => parameters.some((item) => item.in == type));
            const pathKeys = parameters.flatMap((item) => item.in == "path" ? [item.name] : []);
            if (requestBody) {
                params.push('body');
            }
            return { definition, params, pathKeys };
        }
        else {
            console.error('[openapi-to-service] request not found:', `${method}:${path}`);
        }
    }
    getMethodDefinition(definition) {
        if (definition.$ref) {
            const schema = this.openApi.components.schemas[definition.$ref];
            if (!schema) {
                console.error('[openapi-to-service] $ref not found:', definition.$ref);
            }
            return schema;
        }
        return definition;
    }
    getDefaultName(path, method, defined) {
        let name = defined.operationId ?? (0, utils_1.getPathLastName)(path);
        const pathItems = (0, utils_1.urlPathSplit)(path);
        let tag = defined.tags.length ? defined.tags[defined.tags.length - 1] : undefined;
        tag = tag ?? (pathItems.length > 1 ? pathItems[pathItems.length - 2] : '');
        return { name: (0, utils_1.resolveIdentifier)(name), folder: (0, utils_1.resolveIdentifier)(tag) };
    }
    async generator() {
        const folderTree = {};
        const paths = Object.entries(this.apiPaths).reduce((arr, [path, methods]) => {
            const pathDefinition = Object.entries(methods).reduce((obj, [method, methodDefined]) => {
                const methodDefinition = this.getMethodDefinition(methodDefined);
                const defaultName = this.getDefaultName(path, method, methodDefinition);
                let customName = this.config.hook.customName ? this.config.hook.customName({
                    definition: methodDefinition,
                    path,
                    method
                }, defaultName) : defaultName;
                if (customName !== false) {
                    const name = customName?.name ? (0, utils_1.resolveIdentifier)(customName.name) : defaultName.name;
                    const folder = customName?.folder ? (0, utils_1.resolveIdentifier)(customName.folder) : defaultName.folder;
                    const folderNames = (0, utils_1.urlPathSplit)(folder);
                    const folderName = folderNames.join('.');
                    if (!folderTree[folderName]) {
                        folderTree[folderName] = { pathNames: folderNames, items: {} };
                    }
                    if (folderTree[folderName].items[name]) {
                        console.error('[openapi-to-service] duplicate names in the sibling directory:', (0, util_1.format)('?/? ?:?', folderName, name, method, path));
                    }
                    else {
                        folderTree[folderName].items[name] = { path, method, name };
                    }
                    obj[method] = methodDefinition;
                }
                else {
                    delete obj[method];
                }
                return obj;
            }, {});
            if (Object.keys(pathDefinition).length) {
                arr.push([path, pathDefinition]);
            }
            return arr;
        }, []);
        this.openApi.paths = Object.fromEntries(paths);
        const outputDir = await this.getOutputDir();
        const apis = Object.keys(folderTree)
            .sort((a, b) => a.localeCompare(b))
            .map((name) => {
            const items = Object.values(folderTree[name].items);
            items.sort((a, b) => a.name.localeCompare(b.name));
            return { name, items };
        });
        let pathAst = '';
        try {
            pathAst = await openapiTS(this.openApi);
        }
        catch (e) {
            console.error('[openapi-to-service] parse openapi document fail:', e.message);
        }
        const renderContext = {
            apis,
            openapi: this.openApi,
            config: this.config,
            getMethodMetadata: this.getMethodMetadata.bind(this),
            pathAst,
        };
        await this.renderTemplateSave(path.join(outputDir, 'common.ts'), 'common', renderContext);
        await this.renderTemplateSave(path.join(outputDir, 'service.ts'), 'service', renderContext);
        await this.renderTemplateSave(path.join(outputDir, 'index.ts'), 'index', renderContext);
    }
}
exports.GeneratorService = GeneratorService;
