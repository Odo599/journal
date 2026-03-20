import AsyncStorage from "@react-native-async-storage/async-storage";
import readLocalStringList from "@/lib/local/readLocalStringList";

export default async function addImageToDelete(id: string) {
    const current = await readLocalStringList("delete_images")
    current.push(id)
    await AsyncStorage.setItem("delete_images", JSON.stringify(current))
}