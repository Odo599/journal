import {EntryType} from "@/types/EntryType";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function deleteLocalEntry(entry: EntryType) {
    const key = entry.offline ? `offline_entry_${entry.id}` : `entry_${entry.id}`
    try {
        await AsyncStorage.removeItem(key)
    } catch {
    }
}