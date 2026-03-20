import AsyncStorage from "@react-native-async-storage/async-storage";
import {EntryType, isEntry} from "@/types/EntryType";
import dateReviver from "@/lib/dateReviver";

export default async function getLocalEntries(): Promise<EntryType[]> {
    const keys = await AsyncStorage.getAllKeys()
    const entries: EntryType[] = []

    for (let i = 0; i < keys.length; i++) {
        if (keys[i].startsWith("entry_") || keys[i].startsWith("offline_entry_")) {
            const entry_str = await AsyncStorage.getItem(keys[i])
            if (entry_str !== null) {
                const entry_parsed = JSON.parse(entry_str, dateReviver)
                if (isEntry(entry_parsed)) {
                    entries.push(entry_parsed)
                } else {
                    console.error("incorrectly parsed entry", entry_parsed)
                }
            } else {
                console.error("removing null entry with key", keys[i])
                await AsyncStorage.removeItem(keys[i])
            }
        }
    }

    return entries
}