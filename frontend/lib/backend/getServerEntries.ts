import AsyncStorage from '@react-native-async-storage/async-storage';
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import {EntryType, isEntry} from "@/types/EntryType";
import getEntriesToDelete from "@/lib/local/getEntriesToDelete";
import deleteServerEntry from "@/lib/backend/deleteServerEntry";
import dateReviver from "@/lib/dateReviver";
import syncEntries from "@/lib/backend/syncEntries";

export default async function getServerEntries(): Promise<EntryType[]> {
    let api_key = await AsyncStorage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entries, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)

    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/getEntries`
    const response = await fetch(
        url,
        {headers: new Headers([["X-API-Key", api_key ?? ""]])}
    )
    if (response.status === 403) {
        await AsyncStorage.removeItem("api_key")
        throw new NotLoggedInError("couldn't get entries, api key was not valid")
    }

    if (!response.ok) {
        console.error("non 2XX code when getting entries from server", response.status, await response.text())
        return []
    }

    const outputText = await response.text()
    const output = JSON.parse(outputText, dateReviver)
    const entries: EntryType[] = []

    if (Array.isArray(output)) {
        for (let i = 0; i < output.length; i++) {
            if (isEntry(output[i])) {
                entries.push(output[i])
            } else {
                console.error("malformed server entry", output[i])
            }
        }
    } else {
        console.error("server did not return array", output)
    }

    return entries
}