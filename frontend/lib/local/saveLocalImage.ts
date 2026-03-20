import {File, Directory, Paths} from 'expo-file-system';

export default function saveLocalImage(uri: string, id: string) {
    const destination = new Directory(Paths.cache, 'images');
    if (!destination.exists) destination.create()
    const imageCache = new File(uri)
    const image = new File(Paths.document, id)
    console.log(Paths.document.uri)
    if (!image.exists) imageCache.copy(image)
}