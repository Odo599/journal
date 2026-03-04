import AsyncStorage from "@react-native-async-storage/async-storage";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import {EntryType} from "@/types/EntryType";

export default async function createServerEntry(body: string, created: string): Promise<EntryType | null> {
    let api_key = await AsyncStorage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entries, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)

    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/createEntry`
    try {


        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "X-API-Key": api_key ?? "",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "text": body,
                    "created": created
                })
            })


        if (response.status === 403) {
            await AsyncStorage.removeItem("api_key")
            throw new NotLoggedInError("couldn't create entry, api key was not valid")
        }

        if (!response.ok) {
            console.error("non 2XX code when creating entry", response.status, await response.text())
            return null
        }

        const output = await response.text()
        if (!isNaN(Number(output))) {
            return {
                id: Number(output),
                created: created,
                last_edited: new Date().valueOf(),
                body: body
            }
        } else {
            console.warn("creat ")
            return null
        }
    } catch (error) {
        if (error instanceof NotLoggedInError) {
            throw error
        }
        return null
    }
}