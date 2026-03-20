import AsyncStorage from "@react-native-async-storage/async-storage";
import {EntryType} from "@/types/EntryType";

export default async function saveLocalEntry(e: EntryType): Promise<EntryType> {
    let keyId: string;
    if (e.offline) keyId = `offline_entry_${e.id}`
    else keyId = `entry_${e.id}`

    e.last_edited = new Date()
    await AsyncStorage.setItem(keyId, JSON.stringify(e))

    return e
}