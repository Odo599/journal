import {EntryType} from "@/types/EntryType";
import getLocalEntries from "@/lib/local/getLocalEntries";
import getServerEntries from "@/lib/backend/getServerEntries";
import getRecentEntries from "@/lib/merging/getRecentEntries";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import syncEntries from "@/lib/backend/syncEntries";

export default async function getEntries(): Promise<EntryType[]> {
    const localEntries = await getLocalEntries()
    const serverEntries = await (async () => {
        try {
            return await getServerEntries()
        } catch (error) {
            if (error instanceof NotLoggedInError) {
                throw error
            }
            console.error("error when getting server entries", error)
            return null
        }
    })()
    if (serverEntries === null) {
        return localEntries
    }
    await syncEntries(serverEntries)
    return getRecentEntries(localEntries, serverEntries)
}