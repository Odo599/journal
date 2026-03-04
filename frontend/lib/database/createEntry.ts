import {EntryType} from "@/types/EntryType";
import createServerEntry from "@/lib/backend/createServerEntry";
import saveLocalEntry from "@/lib/local/saveLocalEntry";
import getNewOfflineId from "@/lib/local/getNewOfflineId";

export default async function createEntry(text: string = ""): Promise<EntryType> {
    let e = await createServerEntry("", Date().toString())
    if (e === null) {
        e = {
            id: await getNewOfflineId(),
            created: new Date().toString(),
            last_edited: new Date().valueOf(),
            body: text,
            offline: true
        }
    }

    await saveLocalEntry(e)
    return e
}