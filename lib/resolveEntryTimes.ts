import NoAvailableEntryError from "@/lib/errors/NoAvailableEntryError";
import {EntryType, isEntry} from "@/types/EntryType";

export default function resolveEntryTimes(e1: EntryType | null,
                                          e2: EntryType | null,
                                          onNoEntry: (() => void) | undefined = undefined,
                                          onNoEntry1: (() => void) | undefined = undefined,
                                          onNoEntry2: (() => void) | undefined = undefined,
                                          onEntry1: (() => void) | undefined = undefined,
                                          onEntry2: (() => void) | undefined = undefined,
): EntryType | null {
    if (!isEntry(e1) && !isEntry(e2)) {
        if (onNoEntry) {
            onNoEntry()
        }
        throw new NoAvailableEntryError("tried to access a nondefined entry")
    } else if ((!isEntry(e1) || e1?.last_edited === null) && isEntry(e2)) {
        if (onNoEntry1) onNoEntry1()
        if (onEntry2) onEntry2()
        return e2
    } else if ((!isEntry(e2) || e2?.last_edited === null) && isEntry(e1)) {
        if (onNoEntry2) onNoEntry2()
        if (onEntry1) onEntry1()
        return e1
    } else if (e1 !== null && e2 !== null) {
        const e1LastEdited = e1.last_edited
        const e2LastEdited = e2.last_edited

        if (e1LastEdited === null && e2LastEdited === null) {
            return null
        } else { // @ts-ignore
            if (e1LastEdited > e2LastEdited) {
                if (onEntry1) onEntry1()
                return e1
            } else {
                if (onEntry2) onEntry2()
                return e2
            }
        }
    } else {
        throw new NoAvailableEntryError("tried to access a nondefined entry. (this error probably shouldn't happen)")
    }
}