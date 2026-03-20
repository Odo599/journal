import AsyncStorage from '@react-native-async-storage/async-storage';
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import {EntryType, isEntry} from "@/types/EntryType";
import dateReviver from "@/lib/dateReviver";

export default async function getServerEntry(id: string): Promise<EntryType | null> {
    let api_key = await AsyncStorage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entry, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)

    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/entries/${id}`
    const response = await fetch(
        url,
        {headers: new Headers([["X-API-Key", api_key ?? ""]])}
    ).catch(
        () => {
            return null
        }
    )

    if (response === null) return null

    if (response.status === 403) {
        await AsyncStorage.removeItem("api_key")
        throw new NotLoggedInError("couldn't get entries, api key was not valid")
    }

    if (!response.ok) {
        console.error("non 2XX code when getting entries from server", response.status, await response.text())
        return null
    }

    const outputText = await response.text()
    try {
        const output = JSON.parse(outputText, dateReviver)
        if (isEntry(output)) {
            return output
        } else {
            console.error("malformed server entry", output)
            return null
        }
    } catch (e) {
        console.error(e, outputText)
        return null
    }

}