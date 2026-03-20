import {EntryType} from "@/types/EntryType";
import createServerEntry from "@/lib/backend/createServerEntry";
import saveLocalEntry from "@/lib/local/saveLocalEntry";
import uuid from 'react-native-uuid';

export default async function createEntry(text: string = ""): Promise<EntryType> {
    let e = await createServerEntry({
        created: new Date(),
        last_edited: new Date(),
        body: text,
        image_ids: [],
        id: uuid.v4()
    })
    if (e === null) {
        e = {
            id: uuid.v4(),
            created: new Date(),
            last_edited: new Date(),
            body: text,
            offline: true,
            image_ids: []
        }
    }

    await saveLocalEntry(e)
    return e
}