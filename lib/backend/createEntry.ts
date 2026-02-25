import checkOnline from "@/lib/backend/checkOnline";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";

export default async function createEntry(text: string = "") {
    let api_key = await AsyncStorage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entries, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)

    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/createEntry?text=${text}`
    await checkOnline();
    const response = await fetch(
        url,
        {
            method: "POST",
            headers: new Headers([["X-API-Key", api_key ?? ""]])
        })
    if (response.status === 403) {
        await AsyncStorage.removeItem("api_key")
        throw new NotLoggedInError("couldn't create entry, api key was not valid")
    }
    return response
}