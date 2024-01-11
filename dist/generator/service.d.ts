import { GenerateCustomNames, GenerateServiceProps } from "../types";
import type { OpenAPI3, OperationObject, PathsObject, ReferenceObject } from "openapi-typescript/src/types";
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
    protected getMethodMetadata(path: string, method: string): {
        definition: any;
        params: string[];
        pathKeys: any;
    };
    protected getMethodDefinition(definition: OperationObject | ReferenceObject): OperationObject;
    protected getDefaultName(path: string, method: string, defined: OperationObject): GenerateCustomNames;
    generator(): Promise<void>;
}
export {};
