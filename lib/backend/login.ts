import checkOnline from "@/lib/backend/checkOnline";

export default async function login(username: string, password: string) {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/getUserApiKey?username=${username}&password=${password}`
    await checkOnline()
    return await fetch(url, {method: "GET"});
}