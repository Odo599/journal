import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function getNewOfflineId(): Promise<number> {
    const keys = await AsyncStorage.getAllKeys()
    const ids: number[] = []
    keys.forEach((key) => {
        if (key.startsWith("offline_entry_")) {
            const id = Number(key.slice(14, key.length))
            if (!isNaN(id)) ids.push(id)
            else console.warn("non integer id detected with key", key)
        }
    })

    let i = 1;
    while (ids.includes(i)) {
        i++;
    }
    return i

}