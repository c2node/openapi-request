import { GenerateCustomNames, GenerateServiceProps } from "../types";
import { OpenAPI3, OperationObject, PathsObject } from "openapi-typescript/src/types";
import { ResponseType } from "axios";
export type TemplateFileType = 'common' | 'service' | 'index';
type RenderTemplate = (name: string, context: Record<string, any>) => Promise<string>;
export declare class GeneratorService {
    protected readonly openApi: OpenAPI3;
    protected readonly config: Omit<GenerateServiceProps, 'schemaPath'>;
    protected templateEngine: RenderTemplate;
    constructor(openApi: OpenAPI3, config: Omit<GenerateServiceProps, 'schemaPath'>);
    protected getTemplateEngine(): RenderTemplate;
    protected renderTemplateSave(fileName: string, type: TemplateFileType, params: Record<string, any>): Promise<void>;
    get apiPaths(): PathsObject;
    protected clearDir(dirPath: string): Promise<void>;
    protected getOutputDir(): Promise<string>;
    protected getRef(ref: string): unknown;
    protected formatResponseType(mime: string): ResponseType;
    protected operationIdMap: Map<any, any>;
    protected getMethodMetadata(path: string, method: string): {
        definition: any;
        rawDefinition: any;
        params: any;
        contentType: string[];
        responseType: string[];
    };
    protected getDefaultName(path: string, method: string, defined: OperationObject): GenerateCustomNames;
    generator(): Promise<void>;
}
export {};
