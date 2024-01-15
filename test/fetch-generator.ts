import {generateService} from "../src";
import * as path from "path";
import * as fs from "fs";


async function main() {
    // 网络openapi json
    await generateService({
        // 导入自定义请求方法
        requestImport: "import {request,RequestOption} from \"../../fetch-request\"",
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
}

if (require.main.filename === __filename) {
    process.nextTick(main);
}
