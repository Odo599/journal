import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function readImageToUpload(id: string): Promise<string[]> {
    const currentRes = await AsyncStorage.getItem(id)
    let current: string[] = []
    if (currentRes !== null) {
        try {
            const jsonParsed = JSON.parse(currentRes)
            if (Array.isArray(jsonParsed) && jsonParsed.every((s) => typeof s == "string")) {
                current = jsonParsed
            }
        } catch (e) {
            console.error("json syntax error when reading local string list", e, id)
        }
    }

    return current
}