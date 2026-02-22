import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function saveEntry(entry_id: number, body: string, created: string, author_id: number) {
    const entryObj = {
        id: entry_id,
        body: body,
        created: created,
        author_id: author_id,
        last_edited: new Date().getTime()
    }

    await AsyncStorage.setItem(
        `entry_${entry_id}`,
        JSON.stringify(entryObj)
    )
}