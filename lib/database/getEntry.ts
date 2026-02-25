import AsyncStorage from "@react-native-async-storage/async-storage";
import getBackendEntry from "@/lib/backend/getBackendEntry";
import {EntryType, isEntry} from "@/types/EntryType";
import putEntry from "@/lib/backend/putEntry";
import resolveEntryTimes from "@/lib/resolveEntryTimes";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";


export default async function getEntry(entry_id: number): Promise<EntryType> {
    const backendEntryPromise = getBackendEntry(entry_id)
        .then((response) => response.json())
        .then((j) => {
            if (!isEntry(j)) {
                console.error("received malformed entry data", j)
                return null
            } else return j

        })
        .catch((error) => {
            if (error instanceof NotLoggedInError) throw error
            console.error("error while getting entries from server", error)
            return null
        })

    const storageEntryPromise = AsyncStorage.getItem(`entry_${entry_id}`)
        .then((stored) => {
            if (stored != null) {
                const storageEntryParsed = JSON.parse(stored)
                if (isEntry(storageEntryParsed)) return storageEntryParsed
            }
            return null
        }).catch(() => {
            return null
        })

    const [backendEntry, storageEntry] = await Promise.all([backendEntryPromise, storageEntryPromise])

    return (resolveEntryTimes(
        backendEntry,
        storageEntry,
        undefined,   // onNoEntry
        undefined,  // onNoEntry1
        () => {                // onNoEntry2
            console.log("updating server entry with storage", storageEntry)
            if (isEntry(storageEntry)) {
                void putEntry(entry_id, storageEntry.body).catch((e) => {
                    console.error("couldn't update server entry", e)
                })
            }
        },
    ) ?? backendEntry) as EntryType
}
