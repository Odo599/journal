import {EntryType} from "@/types/EntryType";
import putServerEntry from "@/lib/backend/putServerEntry";
import saveLocalEntry from "@/lib/local/saveLocalEntry";
import createServerEntry from "@/lib/backend/createServerEntry";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function putEntry(e: EntryType) {
    if (e.offline) {
        console.log("updating offline entry")
        try {
            const server_entry = await createServerEntry(e.body)
            if (server_entry !== null) {
                await AsyncStorage.removeItem(`offline_entry_${e.id}`)
                e = server_entry
                e.offline = false
            }
        } catch {
            console.log("error when uploading offline entry to server, continuing as offline")
        }
    }
    try {
        await putServerEntry(e)
    } catch (error) {
        console.warn("error when putting entry", error)
    }
    return await saveLocalEntry(e)
}