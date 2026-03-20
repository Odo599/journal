import {EntryType} from "@/types/EntryType";
import deleteServerEntry from "@/lib/backend/deleteServerEntry";
import deleteLocalEntry from "@/lib/local/deleteLocalEntry";
import addEntryToDelete from "@/lib/local/addEntryToDelete";
import deleteImage from "@/lib/database/deleteImage";

export default async function deleteEntry(entry: EntryType) {
    entry.image_ids.forEach(deleteImage)
    if (!entry.offline) {
        const serverDeletionSucceeded = await deleteServerEntry(entry.id)
        if (!serverDeletionSucceeded) {
            await addEntryToDelete(entry)
        }
        await deleteLocalEntry(entry)
    } else {
        await deleteLocalEntry(entry)
    }
}