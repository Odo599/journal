import {Paths, File} from "expo-file-system";

function isUUID(uuid: string) {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(uuid);
}

export default async function getImageURI(id: string): Promise<string | null> {
    let uri: string | null = null

    if (!Paths.document.exists) return null
    Paths.document.list()
        .filter((f): f is File => f instanceof File && isUUID(f.name))
        .forEach((i) => {
            if (i.name === id) uri = i.uri
        })
    return uri
}