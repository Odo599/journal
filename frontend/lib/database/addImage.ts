import postServerImage from "@/lib/backend/postServerImage";
import {EntryType} from "@/types/EntryType";
import saveLocalImage from "@/lib/local/saveLocalImage";
import putEntry from "@/lib/database/putEntry";
import createServerEntry from "@/lib/backend/createServerEntry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import saveLocalEntry from "@/lib/local/saveLocalEntry";
import addImageToUpload from "@/lib/local/addImageToUpload";

export default async function addImage(uri: string, id: string, e: EntryType): Promise<EntryType> {
    if (e.offline) {
        const server_entry = await createServerEntry(e)
        if (server_entry !== null) {
            await AsyncStorage.removeItem(`offline_entry_${e.id}`)
            e = server_entry
            e.offline = false
        } else {
            e.image_ids.push(id)
            await addImageToUpload(id)
            await saveLocalEntry(e)
            return e
        }
    }
    saveLocalImage(uri, id)
    const serverEntry = await postServerImage(uri, id, e)
    if (serverEntry !== null) return serverEntry

    e.image_ids.push(id)

    await putEntry(e)
    return e
}