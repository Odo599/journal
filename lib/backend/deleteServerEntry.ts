import AsyncStorage from "@react-native-async-storage/async-storage";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";

export default async function deleteServerEntry(id: number): Promise<boolean> {
    let api_key = await AsyncStorage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entries, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)

    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/entries/${id}`
    return await fetch(
        url,
        {
            method: "DELETE",
            headers: new Headers([["X-API-Key", api_key ?? ""]])
        })
        .then((r) => {
            if (r.status === 403) {
                AsyncStorage.removeItem("api_key")
                throw new NotLoggedInError("couldn't create entry, api key was not valid")
            }
            if (r.status === 404) {
                console.warn("tried to delete entry not found on server")
                return true
            }
            if (!r.ok) {
                (async (r) => {
                    console.error("non 2XX code when creating entry", r.status, await r.text())
                })(r)
                return false
            }
            if (r.status === 204) {
                return true
            } else {
                (async (r) => {
                    console.error("non 204, 2XX status when creating entry", r.status, await r.text())
                })(r)
                return false
            }
        })
        .catch((error) => {
            if (error instanceof NotLoggedInError) throw error
            console.error("error when deleting entry", error)
            return false
        })
}