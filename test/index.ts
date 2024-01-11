import {generateService} from "../src";
import * as path from "path";
import * as fs from "fs";


async function main() {
    const openapiJsonDir = path.join(__dirname, 'openapi-files');
    const files = await fs.promises.readdir(openapiJsonDir);
    for (const filename of files) {
        const projectName = filename.replace('.json', '').replace('swagger.', '');
        await generateService({
            schemaPath: path.join(openapiJsonDir, filename),
            serversPath: path.join(__dirname, 'service-files'),
            projectName: projectName,
        });
    }
    // {
    //     const files=[
    //         "http://127.0.0.1:4523/export/openapi?projectId=3316209&version=2.0",
    //         "http://127.0.0.1:4523/export/openapi?projectId=3316209&version=3.0",
    //         "http://127.0.0.1:4523/export/openapi?projectId=3316209&version=3.1",
    //     ];
    //     for (const filename of files) {
    //         const urlInfo=new URL(filename);
    //         const projectName = urlInfo.searchParams.get('version');
    //         await generateService({
    //             schemaPath: filename,
    //             serversPath: path.join(__dirname, 'service-files'),
    //             projectName: projectName,
    //         });
    //     }
    // }
}

if (require.main.filename === __filename) {
    process.nextTick(main);
}
