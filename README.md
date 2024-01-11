## 介绍
[![GitHub Repo stars](https://img.shields.io/github/stars/c2node/openapi-to-service?style=social)](https://github.com/c2node/openapi-to-service)
[![npm (scoped)](https://img.shields.io/npm/v/openapi-to-service)](https://www.npmjs.com/package/c2node/openapi-to-service)
![GitHub tag (latest SemVer pre-release)](https://img.shields.io/github/v/tag/c2node/openapi-to-service?include_prereleases)

根据 [OpenApi3](https://swagger.io/blog/news/whats-new-in-openapi-3-0/) 文档生成 request 请求代码。

## 使用
```node
npm i --save-dev @openapi-to-service
```
在项目根目录新建 ```openapi.config.ts```
```ts
const { generateService } = require('openapi-to-service')

generateService({
  schemaPath: 'http://petstore.swagger.io/v2/swagger.json',
  serversPath: './servers',
})

```
在 ```package.json``` 的 ```script``` 中添加 api: ```"openapi": "ts-node openapi.config.ts",```

生成api
```node
npm run openapi
```
## 参数
|  属性   | 必填  | 备注 | 类型 | 默认值 |
|  ----  | ----  |  ----  |  ----  | - |
| requestImport  | 否 | 导入自定义请求方法 | string | import axios from "axios" |
| requestFunction  | 否 | 自定义请求方法名称 | string | axios.request |
| serversPath  | 否 | 生成的文件夹的路径 | string | - |
| schemaPath  | 否 | Swagger 2.0 或 OpenAPI 3.0 的请求地址或本地路径 | string | - |
| projectName  | 否 | 项目名称,如果有将在 serversPath 下创建文件夹 | string | - |
| templatesFolder | 否 | 自定义模板文件的文件路径 | string | - |
| hook.customName | 否 | 自定义请求函数名称，目录名称 | {name:"函数名称",folder:"目录名称"} | - |
|   | 否 | 项目名称,如果有将在 serversPath 下创建文件夹 | string | - |
