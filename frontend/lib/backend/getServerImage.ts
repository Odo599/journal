import AsyncStorage from "@react-native-async-storage/async-storage";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import {Paths, File} from "expo-file-system";
import {fetch} from 'expo/fetch';


export default async function getServerImage(id: string): Promise<string | null> {
    let api_key = await AsyncStorage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entries, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)

    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/images/${id}`
    const file = new File(Paths.document, id)
    const response = await fetch(url, {
        headers: {"X-API-Key": api_key ?? ""}
    })
    file.write(await response.bytes())

    return file.uri
}