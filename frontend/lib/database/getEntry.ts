import getLocalEntry from "@/lib/local/getLocalEntry";
import getServerEntry from "@/lib/backend/getServerEntry";
import getRecentEntry from "@/lib/merging/getRecentEntry";
import {EntryType} from "@/types/EntryType";

export default async function getEntry(id: number, offline: boolean): Promise<EntryType | null> {
    if (offline) return getLocalEntry(id, true)

    const localEntry = await getLocalEntry(id, false)
    const serverEntry = await getServerEntry(id)

    console.log(localEntry, serverEntry)

    const recentEntry = getRecentEntry(localEntry, serverEntry)
    if (recentEntry === false) return serverEntry
    return recentEntry
}