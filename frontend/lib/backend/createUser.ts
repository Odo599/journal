import checkOnline from "@/lib/backend/checkOnline";
import UserAlreadyCreatedError from "@/lib/errors/UserAlreadyCreatedError";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function createUser(username: string, password: string): Promise<string> {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/createUser?username=${username}&password=${password}`
    await checkOnline()
    const response = await fetch(url, {method: 'POST'});

    if (response.status === 409) {
        throw new UserAlreadyCreatedError()
    }
    const key = await response.text()
    await AsyncStorage.setItem("api_key", key);
    return key
}