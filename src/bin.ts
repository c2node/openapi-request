import {generateRequest} from "./index";

function main() {
    const args = process.argv.splice(2);
    if (args.length < 2) {
        console.log("openapi-request schemaPath serversPath")
    } else {
        const [schemaPath, serversPath] = args;
        generateRequest({
            schemaPath,
            serversPath,
        }).then(res => {
            console.log("[openapi-request] " + schemaPath + " ok");
        });
    }
}

process.nextTick(main);
