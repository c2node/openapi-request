import { GenerateServiceProps } from './types';
export declare const DefaultTemplateFolder: string;
export declare function generateRequest({ schemaPath, requestImport, requestFnName, requestParams, requestFnOtherParams, templatesFolder, serversPath, ...options }: GenerateServiceProps): Promise<void>;
