import AsyncStorage from "@react-native-async-storage/async-storage";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import {EntryType} from "@/types/EntryType";

export default async function putServerEntry(e: EntryType): Promise<void> {
    let api_key = await AsyncStorage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entries, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)


    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/entries/${e.id}`
    const response = await fetch(url,
        {
            method: "PUT",
            headers: new Headers([
                ["X-API-Key", api_key ?? ""],
                ["Content-Type", "application/json"]
            ]),
            body: JSON.stringify({
                "text": e.body,
                "created": e.created
            })
        }
    )
    if (response.status === 403) {
        await AsyncStorage.removeItem("api_key")
        throw new NotLoggedInError("couldn't get entries, api key was not valid")
    }
}