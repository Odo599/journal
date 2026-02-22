import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function saveEntry(entry_id: number, body: string, created: string, author_username: string) {
    const entryObj = {
        id: entry_id,
        body: body,
        created: created,
        author_username: author_username,
        last_edited: new Date().getTime()
    }

    await AsyncStorage.setItem(
        `entry_${entry_id}`,
        JSON.stringify(entryObj)
    )
}