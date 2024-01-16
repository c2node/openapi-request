// @ts-nocheck
import {OperationObject} from "openapi-typescript/src/types";

export * from "openapi-typescript-helpers";

export type GenerateCustomNames = { name: string, folder: string };

export type GenerateServiceProps = {
    /**
     * 请求方法导入，默认为 import axios from "axios"
     */
    requestImport?: string;
    /**
     * 请求方法名称，默认为 axios.request
     */
    requestFnName?: string;
    /**
     * 请求方法其他可选参数
     */
    requestFnOtherParams?: { name: string, type: string }[];
    /**
     * 生成的文件夹的路径
     */
    serversPath?: string;
    /**
     * Swagger 2.0 或 OpenAPI 3.0 的请求地址或本地路径
     */
    schemaPath: string;
    /**
     * 项目名称,如果有将在 serversPath 下创建文件夹
     */
    projectName?: string;

    hook?: {
        /** 自定义函数名称 */
        customName?: (data: {
            path: string,
            method: string,
            definition: OperationObject
        }, defaultName: GenerateCustomNames) => GenerateCustomNames | false;
    };
    /**
     * 模板文件的文件路径
     */
    templatesFolder?: string;
};

// 请求服务参数1
export interface OpenapiRequestConfig {
    // 请求 url path
    url: string,
    // 请求方法
    method: string,
    // 是否允许跨站点提交请求，携带Cookie需要
    withCredentials?: boolean,
    // header参数，其中Content-Type为body编码类型
    headers?: Record<string, string>,
    // 请求查询参数
    params?: Record<string, any>,
    // body参数
    data?: Record<string, any> | FormData,
    // 响应类型
    responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream',
}
