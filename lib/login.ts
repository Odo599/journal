export default async function login(username: string, password: string) {
    try {
        const url = `http://127.0.0.1:8000/getUserApiKey?username=${username}&password=${password}`
        const response = await fetch(url, {method: "GET"})
        if (!response.ok) {
            console.error("Response status", response.status);
        }
        const result = await response.text()
        console.log("api key", result)
    } catch (error) {
        // @ts-ignore
        console.error(error)
    }
}