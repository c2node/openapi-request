import {pet} from "./service-files/v2.0";


async function main() {
    const res = await pet.addPet({name: "", photoUrls: []});
}

if (require.main.filename === __filename) {
    process.nextTick(main);
}
