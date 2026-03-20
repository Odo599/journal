import readLocalStringList from "@/lib/local/readLocalStringList";
import deleteServerImage from "@/lib/backend/deleteServerImage";
import {EntryType} from "@/types/EntryType";
import getEntries from "@/lib/database/getEntries";
import {File, Paths} from "expo-file-system"
import postServerImage from "@/lib/backend/postServerImage";

/**
 * Uploads and deletes all of the pending images from the database
 */
export default async function syncImages() {
    const imagesToDelete = await readLocalStringList("delete_images")
    const imagesToUpload = await readLocalStringList("offline_images")
    const entriesPromise = getEntries()

    const deletedPromises: Promise<[string, boolean]>[] = []
    imagesToDelete.forEach((id) => {
        deletedPromises.push(
            deleteServerImage(id)
                .then((succeeded) => [id, succeeded])
        )
    })

    const entries = await entriesPromise

    const uploadedPromises: Promise<[string, boolean]>[] = []
    imagesToUpload.forEach((id) => {
        const eWithImage = entries.filter(
            (e) => e.image_ids.some((
                iid) => iid === id
            )
        )
        if (eWithImage.length > 0) {
            const entry = eWithImage[0]
            const uri = new File(Paths.document, id).uri
            uploadedPromises.push(
                postServerImage(uri, id, entry)
                    .then((value) =>
                        [id, value !== null]
                    )
            )
        }
    })

    Promise.all(deletedPromises).then((output) => {
        const toRemove: string[] = []
        output.forEach((value) => {
            if (value[1]) toRemove.push(value[0])
        })
    })

    Promise.all(uploadedPromises).then((output) => {
        const toRemove: string[] = []
        output.forEach((value) => {
            if (value[1]) toRemove.push(value[0])
        })
    })



}