import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Returns the current stored api key as a string, or false if it could not be parsed or was not stored.
 */
export default async function getApiKey(): Promise<false | string> {
    const api_key_str = await AsyncStorage.getItem("api_key");
    if (api_key_str === null) {
        return false
    }
    try {
        const api_key = JSON.parse(api_key_str)
        if (typeof api_key === "string") return api_key
        else return false
    } catch (e) {
        console.error("error when parsing api key", e)
        return false
    }
}