import {generateRequest} from "../src";
import * as path from "path";
import * as fs from "fs";


async function main() {
    // 本地openapi json
    const openapiJsonDir = path.join(__dirname, 'openapi-files');
    const files = await fs.promises.readdir(openapiJsonDir);
    for (const filename of files) {
        const projectName = filename.replace('.json', '').replace('swagger.', '');
        await generateRequest({
            schemaPath: path.join(openapiJsonDir, filename),
            serversPath: path.join(__dirname, 'service-files'),
            projectName: projectName,
        });
    }
    // 网络openapi json
    await generateRequest({
        schemaPath:"https://petstore.swagger.io/v2/swagger.json",
        serversPath: path.join(__dirname, 'service-files'),
        projectName: "swagger",
    })
}

if (require.main.filename === __filename) {
    process.nextTick(main);
}
