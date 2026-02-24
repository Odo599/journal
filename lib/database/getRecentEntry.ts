import AsyncStorage from "@react-native-async-storage/async-storage";
import getEntry from "@/lib/backend/getEntry";
import {EntryType, isEntry} from "@/types/EntryType";
import putEntry from "@/lib/backend/putEntry";
import resolveEntryTimes from "@/lib/database/resolveEntryTimes";


export default async function getRecentEntry(entry_id: number): Promise<EntryType> {
    let backendEntry;
    let storageEntry;
    try {
        const backendEntryResponse = await getEntry(entry_id)
        backendEntry = await backendEntryResponse.json()
    } catch {
        backendEntry = null
    }

    try {
        const storageResponse = await AsyncStorage.getItem(`entry_${entry_id}`)
        if (storageResponse != null) {
            const storageEntryJSON = JSON.parse(storageResponse)
            if (isEntry(storageEntryJSON)) {
                storageEntry = storageEntryJSON
            } else {
                storageEntry = null
            }
        } else {
            storageEntry = null
        }
    } catch {
        storageEntry = null
    }

    console.log(
        "backendEntry", backendEntry,
        "storageEntry", storageEntry
    )

    return (resolveEntryTimes(
        backendEntry,
        storageEntry,
        undefined,   // onNoEntry
        undefined,  // onNoEntry1
        () => {                // onNoEntry2
            console.log("updating server entry")
            try {
                console.log("updating server entry with storage", storageEntry)
                // @ts-ignore
                void putEntry(entry_id, storageEntry.body)
            } catch (e) {
                console.error("couldn't update server entry", e)
            }
        },
        () => {              // onEntry1
            console.log("using backend entry")
        },
        () => {
            console.log("using database entry")
        }
    ) ?? backendEntry) as EntryType
}