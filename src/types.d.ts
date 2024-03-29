// @ts-nocheck
import {OperationObject, ParameterObject} from "openapi-typescript/src/types";

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
     * 生产胡请求方法Params包含的参数,默认 {path:true,query:true,header:true,cookie:true}
     */
    requestParams?: Record<'path' | 'query' | 'header' | 'cookie', boolean>;
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
    /**
     * 导出的api名称
     */
    exportName?: string;
    /**
     * 导出JSON文件
     * openapi 文件
     * service 描述文件
     */
    exportJson?: boolean | { openapi: boolean, service: boolean };

    hook?: {
        /** 自定义请求方法params参数,参数中如需排除该参数请返回 false */
        customRequestParams?: (data: {
            path: string,
            method: string,
            definition: OperationObject
        }, field: ParameterObject) => boolean,
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
