// @ts-nocheck
import type {OperationObject} from "openapi-typescript/src/types";

export type GenerateCustomNames = { name: string, folder: string };
export type GenerateServiceProps = {
    /**
     * 请求方法导入，默认为 import axios from "axios"
     */
    requestImport?: string;
    /**
     * 请求方法名称，默认为 axios.request
     */
    requestFunction?: string;
    /**
     * 生成的文件夹的路径
     */
    serversPath?: string;
    /**
     * Swagger 2.0 或 OpenAPI 3.0 的请求地址或本地路径
     */
    schemaPath?: string;
    /**
     * 项目名称,如果有将在 serversPath 下创建文件夹
     */
    projectName?: string;

    hook?: {
        /** 自定义函数名称 */
        customName?: (data: OperationObject, defaultName: GenerateCustomNames) => GenerateCustomNames;
    };
    /**
     * 模板文件的文件路径
     */
    templatesFolder?: string;
};
