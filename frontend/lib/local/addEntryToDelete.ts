import {EntryType, isEntry} from "@/types/EntryType";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function addEntryToDelete(entry: EntryType) {
    const currentStr = await AsyncStorage.getItem("entries_to_delete") ?? "[]"
    let current = JSON.parse(currentStr)
    if (Array.isArray(current) && current.every((e) => isEntry(e))) {
        current.push(entry)
    } else {
        console.log("unexpected entries_to_delete value", currentStr)
        current = []
    }
    console.log(current)
    await AsyncStorage.setItem("entries_to_delete", JSON.stringify(current))
}