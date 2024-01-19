"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorService = void 0;
const fs = require("fs");
const path = require("path");
const util_1 = require("util");
const openApiTS = require("openapi-typescript");
const ejs = require("ejs");
const utils_1 = require("../utils");
const index_1 = require("../index");
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
            const readFile = (filename) => {
                const templateFile = path.join(this.config.templatesFolder, filename + '.ejs');
                const defaultTemplateFile = path.join(index_1.DefaultTemplateFolder, filename + '.ejs');
                try {
                    return fs.promises.readFile(templateFile, { encoding: "utf-8" });
                }
                catch (e) {
                    return fs.promises.readFile(defaultTemplateFile, { encoding: "utf-8" });
                }
            };
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
            console.error('[openapi-request] file gen fail:', fileName, 'type:', type);
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
                console.error('[openapi-request] directory create fail:', outputDir);
            }
        }
        if (!isExists) {
            await fs.promises.mkdir(outputDir, { recursive: true });
        }
        return outputDir;
    }
    getRef(ref) {
        return (0, utils_1.getByPath)(this.openApi, (0, utils_1.urlPathSplit)(ref.replace(/^#+\/?/, '')));
    }
    formatResponseType(mime) {
        let type = (0, utils_1.urlPathSplit)(mime).pop().toLowerCase();
        switch (type) {
            case 'json': {
                return type;
            }
            case 'xml':
            case 'html': {
                return 'document';
            }
            case 'plain': {
                return 'text';
            }
            case 'octet-stream': {
                return 'blob';
            }
            case 'x-msgpack': {
                return 'arraybuffer';
            }
            case 'event-stream': {
                return 'stream';
            }
            default: {
                return 'blob';
            }
        }
    }
    operationIdMap = new Map();
    getMethodMetadata(path, method) {
        const paths = this.apiPaths;
        const { customRequestParams } = this.config.hook;
        if (paths[path] && paths[path][method]) {
            const rawDefinition = paths[path][method];
            const definition = { ...rawDefinition };
            const { parameters = [], requestBody } = definition;
            const params = parameters.reduce((obj, parameter) => {
                if (this.config.requestParams[parameter.in]) {
                    const has = customRequestParams ? customRequestParams({
                        path,
                        method,
                        definition
                    }, { ...parameter }) : true;
                    if (has) {
                        if (!obj[parameter.in]) {
                            obj[parameter.in] = { keys: [], required: [], all: true };
                        }
                        obj[parameter.in].keys.push(parameter.name);
                        if (parameter.required) {
                            obj[parameter.in].required.push(parameter.name);
                        }
                    }
                    else if (obj[parameter.in]) {
                        obj[parameter.in].all = false;
                    }
                }
                return obj;
            }, {});
            if (definition.requestBody) {
                if (Object.hasOwn(definition['requestBody'], "$ref")) {
                    const ref = this.getRef(definition['requestBody']['$ref']);
                    if (ref) {
                        definition['requestBody'] = ref;
                    }
                    else {
                        console.error('[openapi-request] $ref not found:', definition['requestBody']['$ref']);
                    }
                }
            }
            const contentType = definition.requestBody?.content ? Object.keys(definition.requestBody?.content) : [];
            if (requestBody) {
                params['body'] = { keys: [], required: [] };
            }
            const responseType = [];
            if (definition['responses']) {
                Object.values(definition['responses']).forEach(({ content }) => {
                    if (content) {
                        Object.keys(content).forEach(resType => {
                            const type = this.formatResponseType(resType);
                            if (!responseType.includes(type)) {
                                responseType.push(type);
                            }
                        });
                    }
                });
            }
            const methodKey = `${method}:${path}`;
            if (!this.operationIdMap.has(methodKey)) {
                const id = `$$${this.operationIdMap.size + 1}$$`;
                this.operationIdMap.set(methodKey, id);
                rawDefinition.operationId = id;
            }
            return { definition, rawDefinition, params, contentType, responseType };
        }
        else {
            console.error('[openapi-request] request not found:', `${method}:${path}`);
        }
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
                const metadata = this.getMethodMetadata(path, method);
                const defaultName = this.getDefaultName(path, method, metadata.definition);
                let customName = this.config.hook.customName ? this.config.hook.customName({
                    definition: metadata.definition,
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
                        console.error('[openapi-request] duplicate names in the sibling directory:', (0, util_1.format)('?/? ?:?', folderName, name, method, path));
                    }
                    else {
                        folderTree[folderName].items[name] = { path, method, name, metadata };
                    }
                    obj[method] = metadata.rawDefinition;
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
            pathAst = await openApiTS(this.openApi, {});
        }
        catch (e) {
            console.error('[openapi-request] parse openapi document fail:', e.message);
        }
        const renderContext = {
            apis,
            openapi: this.openApi,
            config: this.config,
            format: util_1.format,
            dump: (v) => JSON.stringify(v),
            pathAst,
        };
        await this.renderTemplateSave(path.join(outputDir, 'common.ts'), 'common', renderContext);
        await this.renderTemplateSave(path.join(outputDir, 'service.ts'), 'service', renderContext);
        await this.renderTemplateSave(path.join(outputDir, 'index.ts'), 'index', renderContext);
    }
}
exports.GeneratorService = GeneratorService;
