import AsyncStorage from "@react-native-async-storage/async-storage";

import {EntryType, isEntry} from "@/types/EntryType";
import getServerEntries from "@/lib/backend/getServerEntries";
import resolveEntryTimes from "@/lib/resolveEntryTimes";
import putEntry from "@/lib/backend/putEntry";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";

async function getLocalEntries(): Promise<EntryType[]> {
    const keys = await AsyncStorage.getAllKeys()
    const entries: EntryType[] = []
    for (let i = 0; i < keys.length; i++) {
        if (keys[i].startsWith("entry_")) {
            const e = await AsyncStorage.getItem(keys[i])
            const e_parsed = JSON.parse(e ?? "null")
            if (isEntry(e_parsed)) {
                entries.push(e_parsed)
            } else {
                console.warn(`${keys[i]} was invalid in local db: `, e)
            }
        }
    }
    return entries
}

export default async function getEntries(): Promise<EntryType[]> {
    const localEntriesPromise = getLocalEntries();
    const serverEntriesPromise = getServerEntries()
        .then((response) => response.json())
        .then((jsonOutput) => {
            if (Array.isArray(jsonOutput) &&
                jsonOutput.every((e) => isEntry(e))
            ) {
                return jsonOutput
            } else return []
        })
        .catch((error) => {
            if (error instanceof NotLoggedInError) {
                throw error
            }
            console.error("when getting entries from server", error)
            return [] as EntryType[]
        })

    const [localEntries, serverEntries] = await Promise.all([localEntriesPromise, serverEntriesPromise])

    const localEntriesIdMap = new Map<number, EntryType>();
    const serverEntriesIdMap = new Map<number, EntryType>();

    const entry_ids: number[] = [];
    const entries: EntryType[] = [];

    for (let i = 0; i < localEntries.length; i++) {
        const e = localEntries[i]
        if (!entry_ids.includes(e.id)) {
            entry_ids.push(e.id)
        }
        localEntriesIdMap.set(e.id, e)
    }

    for (let i = 0; i < serverEntries.length; i++) {
        const e = serverEntries[i]
        if (!entry_ids.includes(e.id)) {
            entry_ids.push(e.id)
        }
        serverEntriesIdMap.set(e.id, e)
    }

    for (let i = 0; i < entry_ids.length; i++) {
        const eid = entry_ids[i]
        const serverEntry = serverEntriesIdMap.get(eid) ?? null
        const localEntry = localEntriesIdMap.get(eid) ?? null

        const e = resolveEntryTimes(
            serverEntry,
            localEntry,
            undefined,
            () => {
                if (isEntry(localEntry)) putEntry(localEntry.id, localEntry.body).catch((e) => {
                    console.warn("error when updating the servers entry", e)
                })
            }
        )

        if (e !== null) {
            entries.push(e)
        } else {
            console.warn(`couldn't resolve an entry with id ${eid}`, serverEntry, localEntry)
        }
    }

    return entries
}