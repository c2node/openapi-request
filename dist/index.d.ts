import { GenerateServiceProps } from './types';
export declare const DefaultTemplateFolder: string;
export declare function generateRequest({ schemaPath, requestImport, requestFnName, requestFnOtherParams, templatesFolder, serversPath, ...options }: GenerateServiceProps): Promise<void>;
