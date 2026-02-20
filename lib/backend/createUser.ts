import checkOnline from "@/lib/backend/checkOnline";

export default async function createUser(username: string, password: string) {
    const url = `http://127.0.0.1:8000/createUser?username=${username}&password=${password}`
    await checkOnline()
    await fetch(url, {method: 'POST'});
}