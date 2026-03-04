import {EntryType} from "@/types/EntryType";

export default function getRecentEntry(e1: EntryType | null, e2: EntryType | null): EntryType | null | false {
    if (e1 === null && e2 === null) {
        return null
    } else if (e1 === null) {
        return e2
    } else if (e2 === null) {
        return e1
    } else {
        const e1ts = e1.last_edited
        const e2ts = e2.last_edited

        if (e1ts === null && e2ts === null) {
            return false
        } else if (e1ts === null) {
            return e2
        } else if (e2ts === null) {
            return e1
        } else {
            if (e1ts > e2ts) {
                return e1
            } else if (e2ts > e1ts) {
                return e2
            } else {
                return false
            }
        }
    }
}