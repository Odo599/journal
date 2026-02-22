import checkOnline from "@/lib/backend/checkOnline";
import backendHost from "@/lib/backend/backendHost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";

export default async function putEntry(entry_id: number, text: string) {
    let api_key = await AsyncStorage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entries, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)


    const url = `${backendHost}/entries/${entry_id}?text=${text}&api_key=${api_key}`
    await checkOnline()
    const response = await fetch(url, {method: "PUT"})
    if (response.status === 403) {
        await AsyncStorage.removeItem("api_key")
        throw new NotLoggedInError("couldn't get entries, api key was not valid")
    }
    return response
}