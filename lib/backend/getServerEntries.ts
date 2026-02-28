import AsyncStorage from '@react-native-async-storage/async-storage';
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import {EntryType, isEntry} from "@/types/EntryType";
import getEntriesToDelete from "@/lib/local/getEntriesToDelete";
import deleteServerEntry from "@/lib/backend/deleteServerEntry";

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

    const output = await response.json()
    const entries: EntryType[] = []

    if (Array.isArray(output)) {
        for (let i = 0; i < output.length; i++) {
            if (isEntry(output[i])) {
                entries.push(output[i])
            } else {
                console.warn("malformed server entry", output[i])
            }
        }
    } else {
        console.warn("server did not return array", output)
    }

    const deletedEntries = await getEntriesToDelete()
    const deletePromises: Promise<boolean>[] = []
    entries.forEach((e) => {
        if (deletedEntries.some((de) => de.id === e.id)) {
            deletePromises.push(deleteServerEntry(e.id))
            entries.splice(entries.indexOf(e), 1)
        }
    })

    await Promise.all(deletePromises)

    return entries
}