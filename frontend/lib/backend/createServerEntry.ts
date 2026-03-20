import AsyncStorage from "@react-native-async-storage/async-storage";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import {EntryType, isEntry} from "@/types/EntryType";
import dateReviver from "../dateReviver";

export default async function createServerEntry(entry: EntryType): Promise<EntryType | null> {
    let api_key = await AsyncStorage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entries, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)

    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/createEntry`
    try {

        console.log("input date", entry.created.toISOString())
        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "X-API-Key": api_key ?? "",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "body": entry.body,
                    "created": entry.created.toISOString(),
                    "last_edited": entry.last_edited.toISOString(),
                    "image_ids": entry.image_ids,
                    "id": entry.id
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

        const outputText = await response.text()
        console.log("server returned", outputText)
        const output = JSON.parse(outputText, dateReviver)
        if (isEntry(output)) {
            console.log("output date", output.created.toISOString())
            return output
        } else {
            console.error("non entry response received", output)
            return null
        }
    } catch (error) {
        if (error instanceof NotLoggedInError) {
            throw error
        }
        return null
    }
}