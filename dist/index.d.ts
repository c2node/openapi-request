import { GenerateServiceProps } from './types';
export declare const DefaultTemplateFolder: string;
export declare function generateService({ schemaPath, requestImport, requestFnName, requestFnOtherParams, templatesFolder, serversPath, ...options }: GenerateServiceProps): Promise<void>;
