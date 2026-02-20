export default async function login(username: string, password: string) {
    const url = `http://127.0.0.1:8000/getUserApiKey?username=${username}&password=${password}`
    const response = await fetch(url, {method: "GET"})
    if (!response.ok) {
        console.error("Response status", response.status);
    }
    return await response.text()
}