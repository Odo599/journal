import AsyncStorage from "@react-native-async-storage/async-storage";
import readLocalStringList from "@/lib/local/readLocalStringList";

export default async function addImageToUpload(id: string) {
    const current = await readLocalStringList("offline_images")
    current.push(id)
    await AsyncStorage.setItem("offline_images", JSON.stringify(current))
}