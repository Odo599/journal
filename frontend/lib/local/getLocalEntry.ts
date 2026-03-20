import AsyncStorage from "@react-native-async-storage/async-storage";
import {EntryType, isEntry} from "@/types/EntryType";
import dateReviver from "@/lib/dateReviver";

export default async function getLocalEntry(id: string, offline: boolean): Promise<EntryType | null> {
    let storageKey: string
    if (offline) storageKey = `offline_entry_${id}`
    else storageKey = `entry_${id}`

    const entryStr = await AsyncStorage.getItem(storageKey)
    if (entryStr === null) return null
    const entry = JSON.parse(entryStr, dateReviver)

    if (isEntry(entry)) {
        return entry
    } else {
        console.error("local db entry was not valid", storageKey, entry)
        return null
    }
}