import AsyncStorage from '@react-native-async-storage/async-storage';
import checkOnline from "@/lib/backend/checkOnline";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";

export default async function getEntry(id: number) {
    let api_key = await AsyncStorage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entry, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)

    await checkOnline()
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/entries/${id}`
    const response = await fetch(
        url,
        {headers: new Headers([["X-API-Key", api_key ?? ""]])}
    )
    if (response.status === 403) {
        await AsyncStorage.removeItem("api_key")
        throw new NotLoggedInError("couldn't get entries, api key was not valid")
    }
    return response
}