import AsyncStorage from "@react-native-async-storage/async-storage";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import getApiKey from "@/lib/database/getApiKey";


/**
 * Deletes an image on the server,
 * returns true if succeeded or false if not
 * @param id The id of the image to delete
 */
export default async function deleteServerImage(id: string): Promise<boolean> {
    let api_key = await getApiKey()
    if (!api_key) {
        throw new NotLoggedInError("couldn't get entries, database didn't have api key stored")
    }

    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/images/${id}`
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "X-API-Key": api_key
            }
        })

        if (response.status === 403) {
            await AsyncStorage.removeItem("api_key")
            throw new NotLoggedInError("couldn't get entries, api key was not valid")
        } else if (response.status === 404) {
            return true
        } else if (response.status !== 204) {
            console.error("non 204, 403, 404 code when getting entries from server", response.status, await response.text())
            return false
        } else {
            return true
        }
    } catch (e) {
        if (e instanceof NotLoggedInError) throw e
        console.error("error when deleting image")
        return false
    }
}