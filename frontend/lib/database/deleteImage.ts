import deleteLocalImage from "@/lib/local/deleteLocalImage";
import deleteServerImage from "@/lib/backend/deleteServerImage";
import addImageToDelete from "@/lib/local/addImageToDelete";

export default async function deleteImage(id: string) {
    deleteLocalImage(id)
    const deletedOnServer = await deleteServerImage(id)
    if (deletedOnServer) return
    await addImageToDelete(id)
}