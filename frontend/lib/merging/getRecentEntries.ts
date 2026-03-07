import {EntryType, isEntry} from "@/types/EntryType";
import getRecentEntry from "@/lib/merging/getRecentEntry";

export default async function getRecentEntries(e1: EntryType[], e2: EntryType[]): Promise<EntryType[]> {
    const entries = [...e1, ...e2];
    const map: Map<string, EntryType | null> = new Map();

    entries.forEach((e) => {
        let id: string;
        if (e.offline) {
            id = `offline_${e.id}`
        } else {
            id = `online_${e.id}`
        }
        if (map.has(id)) {
            let recent = getRecentEntry(e, map.get(id) ?? null)
            if (recent === false) {
                recent = e
            }
            map.set(id, recent)
        } else {
            map.set(id, e)
        }
    })


    const mergedEntries: EntryType[] = []
    Array.from(map).forEach((e) => {
        if (isEntry(e[1])) {
            mergedEntries.push(e[1])
        } else {
            console.error("malformed entry while resolving recent entries", e)
        }
    })

    return mergedEntries
}