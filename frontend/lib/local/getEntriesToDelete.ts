import {EntryType, isEntry} from "@/types/EntryType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dateReviver from "@/lib/dateReviver";

export default async function getEntriesToDelete(): Promise<EntryType[]> {
    const currentStr = await AsyncStorage.getItem("entries_to_delete") ?? "[]"
    let current = JSON.parse(currentStr, dateReviver)
    if (Array.isArray(current) && current.every((e) => isEntry(e))) {
        return current
    } else {
        console.error("unexpected entries_to_delete value", currentStr)
        return []
    }
}