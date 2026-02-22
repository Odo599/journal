import checkOnline from "@/lib/backend/checkOnline";

export default async function createUser(username: string, password: string) {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/createUser?username=${username}&password=${password}`
    await checkOnline()
    await fetch(url, {method: 'POST'});
}