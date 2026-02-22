import AsyncStorage from "@react-native-async-storage/async-storage";
import getEntry from "@/lib/backend/getEntry";
import NoAvailableEntryError from "@/lib/errors/NoAvailableEntryError";
import {EntryType, isEntry} from "@/types/EntryType";
import putEntry from "@/lib/backend/putEntry";


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

    console.log(backendEntry, storageEntry)

    if (!isEntry(backendEntry) && !isEntry(storageEntry)) {
        console.warn("tried to access a nondefined entry")
        throw new NoAvailableEntryError(undefined)
    } else if (!isEntry(storageEntry) || storageEntry?.last_edited === null) {
        return backendEntry
    } else if ((!isEntry(backendEntry) || backendEntry?.last_edited === null) && storageEntry !== null) {
        void (async () => {
            console.log("updating server entry")
            try {
                void putEntry(entry_id, storageEntry.body)
            } catch (e) {
                console.error("couldn't update server entry", e)
            }
        })()
        return storageEntry
    } else if (storageEntry !== null && backendEntry !== null) {
        const storageEntryLastEdited = storageEntry.last_edited
        const backendEntryLastEdited = backendEntry.last_edited

        console.log("storage entry:", storageEntryLastEdited, "backend entry:", backendEntryLastEdited)

        if (storageEntryLastEdited > backendEntryLastEdited) {
            void (async () => {
                console.log("updating server entry")
                try {
                    void putEntry(entry_id, storageEntry.body)
                } catch (e) {
                    console.error("couldn't update server entry", e)
                }
            })()
            console.log("returning storage")
            return storageEntry
        } else {
            console.log("returning backend")
            return backendEntry
        }
    } else {
        console.warn("tried to access a nondefined entry")
        throw new NoAvailableEntryError(undefined)
    }
}