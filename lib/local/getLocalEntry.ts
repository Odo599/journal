import AsyncStorage from "@react-native-async-storage/async-storage";
import {EntryType, isEntry} from "@/types/EntryType";

export default async function getLocalEntry(id: number, offline: boolean): Promise<EntryType | null> {
    let storageKey: string
    if (offline) storageKey = `offline_entry_${id}`
    else storageKey = `entry_${id}`

    const entryStr = await AsyncStorage.getItem(storageKey)
    if (entryStr === null) return null
    const entry = JSON.parse(entryStr)

    if (isEntry(entry)) {
        return entry
    } else {
        console.warn("local db entry was not valid", storageKey, entry)
        return null
    }
}