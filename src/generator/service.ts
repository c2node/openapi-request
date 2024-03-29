import {GenerateCustomNames, GenerateServiceProps} from "../types";
import * as fs from "fs";
import * as path from "path";
import {format} from "util";
import * as openApiTS from "openapi-typescript";
import type {OpenAPITSOptions} from "openapi-typescript";
import * as ejs from "ejs";
// @ts-nocheck
import {
    OpenAPI3,
    OperationObject,
    PathsObject,
    ParameterObject, ResponseObject
} from "openapi-typescript/src/types";
import {getByPath, getPathLastName, resolveIdentifier, toPinyin, urlPathSplit} from "../utils";
import {DefaultTemplateFolder} from "../index";
import * as process from "process";
import {ResponseType} from "axios";

export type TemplateFileType = 'common' | 'service' | 'index';

type RenderTemplate = (name: string, context: Record<string, any>) => Promise<string>;

export class GeneratorService {
    protected templateEngine: RenderTemplate;

    constructor(protected readonly openApi: OpenAPI3, protected readonly config: Omit<GenerateServiceProps, 'schemaPath'>) {
    }

    /**
     * 获取模板引擎
     * @private
     */
    protected getTemplateEngine() {
        if (!this.templateEngine) {
            const readFile = (filename: string) => {
                const templateFile = path.join(this.config.templatesFolder, filename + '.ejs');
                const defaultTemplateFile = path.join(DefaultTemplateFolder, filename + '.ejs')
                try {
                    return fs.promises.readFile(templateFile, {encoding: "utf-8"});
                } catch (e) {
                    return fs.promises.readFile(defaultTemplateFile, {encoding: "utf-8"});
                }
            };
            this.templateEngine = async (name: string, context: Record<string, any>) => {
                const template = await readFile(name);
                const temp = ejs.compile(template);
                return temp(context);
            };
        }
        return this.templateEngine;
    }

    /**
     * 渲染模板并保存
     * @param fileName
     * @param type
     * @param params
     * @private
     */
    protected async renderTemplateSave(
        fileName: string,
        type: TemplateFileType,
        params: Record<string, any>,
    ) {
        try {
            const template = this.getTemplateEngine();
            const res = await template(type, params);
            await fs.promises.writeFile(fileName, res);
        } catch (error) {
            console.error('[openapi-request] file gen fail:', fileName, 'type:', type);
            throw error;
        }
    }

    get apiPaths(): PathsObject {
        return this.openApi.paths ?? {};
    }

    /**
     * 清空指定路径下文件
     * @param dirPath
     * @protected
     */
    protected async clearDir(dirPath: string) {
        const files = await fs.promises.readdir(dirPath, {encoding: "utf-8"});
        for (const filename of files) {
            const filePath = path.join(dirPath, filename);
            const stat = await fs.promises.stat(filePath);
            if (stat.isDirectory()) {
                await this.clearDir(filePath);
                await fs.promises.unlink(filePath);
            } else {
                await fs.promises.unlink(filePath);
            }
        }
    }

    /**
     * 获取输出文件夹
     * @protected
     */
    protected async getOutputDir() {
        let outputDir = this.config.serversPath;
        if (this.config.projectName) {
            outputDir = path.join(outputDir, this.config.projectName);
        }
        let isExists = false;
        if (fs.existsSync(outputDir)) {
            // 清空文件夹
            const stat = await fs.promises.stat(outputDir);
            if (stat.isDirectory()) {
                await this.clearDir(outputDir);
                isExists = true;
            } else {
                console.error('[openapi-request] directory create fail:', outputDir);
            }
        }
        if (!isExists) {
            await fs.promises.mkdir(outputDir, {recursive: true});
        }
        return outputDir;
    }

    protected getRef(ref: string) {
        return getByPath(this.openApi, urlPathSplit(ref.replace(/^#+\/?/, '')));
    }

    /**
     * 格式化响应类型
     * @param mime
     * @protected
     */
    protected formatResponseType(mime: string): ResponseType {
        let type = urlPathSplit(mime).pop().toLowerCase();
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

    protected operationIdMap = new Map();

    protected getMethodMetadata(path: string, method: string) {
        const paths = this.apiPaths;
        const {customRequestParams} = this.config.hook;
        //
        if (paths[path] && paths[path][method]) {
            const rawDefinition = paths[path][method];
            const definition = {...rawDefinition};
            const {parameters = [], requestBody} = definition;
            const params = parameters.reduce((obj, parameter: ParameterObject) => {
                if (this.config.requestParams[parameter.in]) {
                    const has = customRequestParams ? customRequestParams({
                        path,
                        method,
                        definition
                    }, {...parameter}) : true;
                    if (has) {
                        if (!obj[parameter.in]) {
                            obj[parameter.in] = {keys: [], required: [], all: true}
                        }
                        obj[parameter.in].keys.push(parameter.name)
                        if (parameter.required) {
                            obj[parameter.in].required.push(parameter.name);
                        }
                    } else if (obj[parameter.in]) {
                        obj[parameter.in].all = false;
                    }
                }
                return obj;
            }, {} as Record<"path" | "query" | "header" | "cookie" | "body", { keys: string[], required: string[] }>)
            if (definition.requestBody) {
                if (Object.hasOwn(definition['requestBody'], "$ref")) {
                    const ref = this.getRef(definition['requestBody']['$ref']);
                    if (ref) {
                        definition['requestBody'] = ref;
                    } else {
                        console.error('[openapi-request] $ref not found:', definition['requestBody']['$ref']);
                    }
                }
            }
            const contentType = definition.requestBody?.content ? Object.keys(definition.requestBody?.content) : [];
            if (requestBody) {
                params['body'] = {keys: [], required: []};
            }
            const responseType: string[] = [];
            if (definition['responses']) {
                Object.values(definition['responses']).forEach(({content}: ResponseObject) => {
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
            // 重新映射operationId,以防止项目中operationId重复，导致生成的parameters or responses 类型错误问题
            const methodKey = `${method}:${path}`;
            if (!this.operationIdMap.has(methodKey)) {
                const id = `$$${this.operationIdMap.size + 1}$$`;
                this.operationIdMap.set(methodKey, id);
                rawDefinition.operationId = id;
            }
            return {definition, rawDefinition, params, contentType, responseType};
        } else {
            console.error('[openapi-request] request not found:', `${method}:${path}`);
        }
    }

    protected getDefaultName(path: string, method: string, defined: OperationObject): GenerateCustomNames & {
        folderLabel: string
    } {
        let name = defined.operationId ?? getPathLastName(path);
        const pathItems = urlPathSplit(path);
        let tag = defined.tags.length ? defined.tags[defined.tags.length - 1] : undefined;
        tag = tag ?? (pathItems.length > 1 ? pathItems[pathItems.length - 2] : '');
        const folderLabel = resolveIdentifier(tag, false);
        return {name: resolveIdentifier(name), folder: toPinyin(folderLabel), folderLabel};
    }

    async generator() {
        type ApiTreeItem = {
            path?: string,
            method?: string,
            name: string,
            metadata: ReturnType<typeof this['getMethodMetadata']>
        };
        const folderTree: Record<string, {
            pathNames: string[],
            label: string,
            items: Record<string, ApiTreeItem>
        }> = {};
        const paths = Object.entries(this.apiPaths).reduce((arr, [path, methods]) => {
            const pathDefinition = Object.entries(methods).reduce((obj, [method, methodDefined]) => {
                const metadata = this.getMethodMetadata(path, method);
                const {folderLabel, ...defaultName} = this.getDefaultName(path, method, metadata.definition);
                let customName = this.config.hook.customName ? this.config.hook.customName({
                    definition: metadata.definition,
                    path,
                    method
                }, defaultName) : defaultName;
                if (customName !== false) {
                    const name = customName?.name ? resolveIdentifier(customName.name) : defaultName.name;
                    const folder = customName?.folder ? resolveIdentifier(customName.folder) : defaultName.folder;
                    const folderNames = urlPathSplit(folder);
                    const folderName = folderNames.join('.');
                    if (!folderTree[folderName]) {
                        folderTree[folderName] = {pathNames: folderNames, label: folderLabel, items: {}};
                    }
                    if (folderTree[folderName].items[name]) {
                        console.error('[openapi-request] duplicate names in the sibling directory:', format('?/? ?:?', folderName, name, method, path));
                    } else {
                        folderTree[folderName].items[name] = {path, method, name, metadata};
                    }
                    obj[method] = metadata.rawDefinition;
                } else {
                    // 删除接口
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
        // 对接口进行排序
        const apis = Object.keys(folderTree)
            .sort((a, b) => a.localeCompare(b))
            .map((name) => {
                const {label} = folderTree[name];
                const items = Object.values(folderTree[name].items);
                items.sort((a, b) => a.name.localeCompare(b.name));
                return {name, label, items};
            });
        let pathAst = '';
        try {
            pathAst = await (openApiTS as any)(this.openApi, {} as OpenAPITSOptions);
        } catch (e) {
            console.error('[openapi-request] parse openapi document fail:', e.message);
        }
        const renderContext = {
            apis,
            openapi: this.openApi,
            config: this.config,
            format,
            dump: (v: any) => JSON.stringify(v),
            pathAst,
        };
        await this.renderTemplateSave(path.join(outputDir, 'common.ts'), 'common', renderContext);
        await this.renderTemplateSave(path.join(outputDir, 'service.ts'), 'service', renderContext);
        await this.renderTemplateSave(path.join(outputDir, 'index.ts'), 'index', renderContext);
        if (this.config.exportJson) {
            const exportOpenapi = this.config.exportJson === true || this.config.exportJson.openapi;
            const exportService = this.config.exportJson === true || this.config.exportJson.service;
            if (exportOpenapi) {
                await fs.promises.writeFile(path.join(outputDir, 'openapi.json'), JSON.stringify(this.openApi), {encoding: "utf-8"});
            }
            if (exportService) {
                await fs.promises.writeFile(path.join(outputDir, 'service.json'), JSON.stringify(apis.map((item) => {
                    return {
                        id: item.name, label: item.label, items: item.items.map(({path, method, name, metadata}) => {
                            return {
                                path,
                                method,
                                name,
                                title: metadata.rawDefinition.summary,
                                description: metadata.rawDefinition.description,
                                responseType: metadata.responseType.length ? metadata.responseType[0] : ''
                            }
                        })
                    }
                })), {encoding: "utf-8"});
            }
        }
    }
}
