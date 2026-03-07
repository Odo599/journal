import {EntryType} from "@/types/EntryType";
import deleteServerEntry from "@/lib/backend/deleteServerEntry";
import deleteLocalEntry from "@/lib/local/deleteLocalEntry";
import addEntryToDelete from "@/lib/local/addEntryToDelete";

export default async function deleteEntry(entry: EntryType) {
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