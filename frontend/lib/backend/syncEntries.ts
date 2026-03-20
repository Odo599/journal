import getServerEntries from "@/lib/backend/getServerEntries";
import getEntriesToDelete from "@/lib/local/getEntriesToDelete";
import {EntryType} from "@/types/EntryType";
import deleteServerEntry from "@/lib/backend/deleteServerEntry";

export default async function syncEntries(serverEntries: EntryType[] | undefined = undefined) {
    const entries: false | EntryType[] = serverEntries ? serverEntries :
        await getServerEntries()
            .catch((e) => {
                console.error("error when syncing entries", e)
                return false
            })
    if (entries) {
        const entriesToDelete = await getEntriesToDelete()
        const deletePromises: Promise<boolean>[] = []
        entries.forEach((e) => {
            if (entriesToDelete.some((de) => {
                return de.id === e.id
            })) {
                deletePromises.push(deleteServerEntry(e.id))
                entries.splice(entries.indexOf(e), 1)
            }
        })
        await Promise.all(deletePromises)
    }
    // todo finish
}