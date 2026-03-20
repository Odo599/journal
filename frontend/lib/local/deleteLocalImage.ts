import {File, Paths} from 'expo-file-system';

export default function deleteLocalImage(id: string) {
    const file = new File(Paths.document, id)
    try {
        file.delete()
    } catch (e) {
        console.warn("error when deleting file", e)
    }
}