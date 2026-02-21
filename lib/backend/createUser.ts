import checkOnline from "@/lib/backend/checkOnline";
import backendHost from "@/lib/backend/backendHost";

export default async function createUser(username: string, password: string) {
    const url = `${backendHost}/createUser?username=${username}&password=${password}`
    await checkOnline()
    await fetch(url, {method: 'POST'});
}