import {createAsyncStorage} from "@react-native-async-storage/async-storage";
import checkOnline from "@/lib/backend/checkOnline";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";

export default async function getEntry(id: number) {
    const storage = createAsyncStorage("appDB")
    let api_key = await storage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entry, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)

    await checkOnline()
    const url = `http://127.0.0.1:8000/entries/${id}?api_key=${api_key}`
    const response = await fetch(url)
    if (response.status === 403) {
        await storage.removeItem("api_key")
        throw new NotLoggedInError("couldn't get entries, api key was not valid")
    }
    return response
}