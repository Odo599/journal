import checkOnline from "@/lib/backend/checkOnline";
import backendHost from "@/lib/backend/backendHost";

export default async function login(username: string, password: string) {
    const url = `${backendHost}/getUserApiKey?username=${username}&password=${password}`
    await checkOnline()
    return await fetch(url, {method: "GET"});
}