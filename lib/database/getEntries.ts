import {EntryType} from "@/types/EntryType";
import getLocalEntries from "@/lib/local/getLocalEntries";
import getServerEntries from "@/lib/backend/getServerEntries";
import getRecentEntries from "@/lib/merging/getRecentEntries";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";

export default async function getEntries(): Promise<EntryType[]> {
    const localEntries = await getLocalEntries()
    const serverEntries = await (async () => {
        try {
            return await getServerEntries()
        } catch (error) {
            if (error instanceof NotLoggedInError) {
                throw error
            }
            console.warn("error when getting server entries", error)
            return null
        }
    })()
    if (serverEntries === null) {
        console.log("returning local entries, server entries is null", localEntries)
        return localEntries
    }
    return getRecentEntries(localEntries, serverEntries)
}