export default function createUser(username: string, password: string) {
    try {
        console.log()
        const url = `http://127.0.0.1:8000/createUser?username=${username}&password=${password}`
        fetch(url, {
            method: 'POST'
        });
    } catch (error) {
        console.error(error)
    }
}