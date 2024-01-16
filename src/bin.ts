import {generateService} from "./index";

function main() {
    const args = process.argv.splice(2);
    if (args.length < 2) {
        console.log("openapi-to-service schemaPath serversPath")
    } else {
        const [schemaPath, serversPath] = args;
        generateService({
            schemaPath,
            serversPath,
        }).then(res => {
            console.log("[openapi-to-service] " + schemaPath + " ok");
        });
    }
}

process.nextTick(main);
