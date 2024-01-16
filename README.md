## 介绍
[![npm (scoped)](https://img.shields.io/npm/v/openapi3-request)](https://www.npmjs.com/package/c2node/openapi3-request)

根据 [OpenApi3](https://swagger.io/blog/news/whats-new-in-openapi-3-0/) 文档快速生成 request 请求代码，默认生成使用的请求库axios，也可使用其定义请求方法。

## 使用
1. 安装
    ```node
    npm i --save-dev openapi3-request openapi-typescript-helpers
    ```
1. 在项目根目录新建 ```openapi.config.ts```
    ```ts
    const { generateService } = require('openapi3-request')

    generateService({
        // Swagger 2.0 或 OpenAPI 3.0 的请求地址或本地路径
        schemaPath: 'http://petstore.swagger.io/v2/swagger.json',
        // 生成的文件夹的路径
        serversPath: './servers',
        // 项目名称,如果有将在 serversPath 下创建文件夹，适用于一个项目有多个请求服务
        projectName: "swagger",
        // hook 示例
        hook:{
            // 自定义请求函数名称，目录名称
            customName({path,method,definition},defaultName){
                if(path==="/test/test"){
                    return false;
                }
                if (path === '/system/menu/list') {
                return {folder:"system",name:"getMenuList"};
                }
                return defaultName;
            }
        }
    })

    ```
1. 执行命令生成请求方法
   在 ```package.json``` 的 ```script``` 中添加 api: ```"openapi":"ts-node openapi.config.ts",```

   执行命令生成api
    ```node
    npm run openapi

    ```
1. **示例参考**
   [https://github.com/c2node/openapi3-request/tree/main/test](https://github.com/c2node/openapi3-request/tree/main/test)
## 自定义请求方法
当使用axios外的请求库或需要对axios请求方法进行扩展可自定义请求方法进行实现
1. 请求方法参数说明
   请求方法默认接受2个参数，参数2和其他参数可通过`requestFnOtherParams`进行配置，需要注意的是：**除参数1外，都是可选参数**
   - 参数1:ServiceRequestConfig
   ```ts
   export interface ServiceRequestConfig {
       url: string,
       method: string,
       // 是否允许跨站点提交请求，携带Cookie需要
       withCredentials?:bool,
       // header参数，其中content-type为body编码类型
       headers?: Record<string, string>,
       // 请求查询参数
       params?: Record<string, any>,
       // body参数
       data?: Record<string, any> | FormData,
       // 响应类型
       responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream',
   }
   ```

   - 参数2 option?:Omit<axios.AxiosRequestConfig,"url"|"method">
1. `fetch` 请求示例
   1. `src/fetch-request.ts`
   ```ts
   import {Openapi3RequestConfig} from "openapi3-request/types";


   const baseUrl = 'http://127.0.0.1:8080';
   export type RequestOption = Omit<RequestInit, 'body'>;

   export function request<Response>(config: Openapi3RequestConfig, {
       headers: _headers = {},
       ...option
   }: RequestOption = {}) {
       const {
           url,
           method,
           params = {},
           headers = {},
           data,
           responseType,
           withCredentials = false
       } = config;
       const urlData = new URL(url, baseUrl);
       urlData.searchParams
       let body
       switch (headers['content-type']) {
           case 'multipart/form-data': {
               body = new FormData();
               Object.keys(data).forEach(key => {
                   body.append(key, data[key]);
               });
               break;
           }
           case 'application/json': {
               body = JSON.stringify(data);
               break;
           }
           default: {
               // application/x-www-form-urlencoded 或其它格式
               body = new URLSearchParams(Object.entries(data)).toString();
               break;
           }
       }
       Object.keys(params ?? {}).forEach(key => {
           urlData.searchParams.append(key, params[key]);
       });
       return fetch(urlData, {
           method,
           headers: {...headers, ..._headers},
           body,
           ...option,
           credentials: withCredentials ? 'include' : undefined,
       }).then(res => {
           if (responseType === 'json') {
               return res.json() as Response
           }
           return res.text() as Response;
       })
   }
   ``` 
   1. `openapi.config.ts`
   ```ts
       const { generateService } = require('openapi3-request')
       await generateService({
           // 导入自定义请求方法
           requestImport: "import {request,RequestOption} from \"src/fetch-request\"",
           // 自定义请求方法名称
           requestFnName: "request",
           // 自定义请求方法其他可选参数
           requestFnOtherParams: [{name: "option", type: "RequestOption"}],
           // Swagger 2.0 或 OpenAPI 3.0 的请求地址或本地路径
           schemaPath: 'http://petstore.swagger.io/v2/swagger.json',
           // 生成的文件夹的路径
           serversPath: './service-files',
           // 项目名称,如果有将在 serversPath 下创建文件夹，适用于一个项目有多个请求服务
           projectName: "swagger-fetch",
           // hook 示例
           hook: {
               // 自定义请求函数名称，目录名称
               customName({path, method, definition}, defaultName) {
                   if (path === "/store/inventory") {
                       return false;
                   }
                   if (path === '/user/{username}' && method === "get") {
                       return {folder: "system", name: "userInfo"};
                   }
                   return defaultName;
               }
           }
       });
   ``` 
   1. 生成代码参照
      [https://github.com/c2node/openapi3-request/tree/main/test/service-files/swagger-fetch](https://github.com/c2node/openapi3-request/tree/main/test/service-files/swagger-fetch)
## 参数
|  属性   | 必填  | 备注 | 类型 | 默认值 |
|  ----  | ----  |  ----  |  ----  | - |
| requestImport  | 否 | 导入自定义请求方法 | string | import axios from "axios" |
| requestFnName  | 否 | 自定义请求方法名称 | string | axios.request |
| requestFnOtherParams | 否 | 自定义请求方法其他可选参数 | { name: string, type: string }[] | [] |
| serversPath  | 否 | 生成的文件夹的路径 | string | - |
| schemaPath  | 是 | Swagger 2.0 或 OpenAPI 3.0 的请求地址或本地路径 | string | - |
| projectName  | 否 | 项目名称,如果有将在 serversPath 下创建文件夹 | string | - |
| templatesFolder | 否 | 自定义模板文件的文件路径 | string | - |
| hook.customName | 否 | 自定义请求函数名称，目录名称 | {name:"函数名称",folder:"目录名称"} | - |
