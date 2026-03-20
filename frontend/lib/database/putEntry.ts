import {EntryType} from "@/types/EntryType";
import putServerEntry from "@/lib/backend/putServerEntry";
import saveLocalEntry from "@/lib/local/saveLocalEntry";
import createServerEntry from "@/lib/backend/createServerEntry";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function putEntry(e: EntryType) {
    if (e.offline) {
        try {
            const server_entry = await createServerEntry(e)
            if (server_entry !== null) {
                await AsyncStorage.removeItem(`offline_entry_${e.id}`)
                e = server_entry
                e.offline = false
            }
        } catch {
            console.warn("error when uploading offline entry to server, continuing as offline")
        }
    }
    try {
        await putServerEntry(e)
    } catch (error) {
        console.error("error when putting entry", error)
    }
    return await saveLocalEntry(e)
}