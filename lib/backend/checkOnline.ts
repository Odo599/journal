import CannotConnectError from "@/lib/errors/CannotConnect";

export default async function checkOnline() {
    try {
        await fetch(
            "http://127.0.0.1:8000/health",
            {method: "GET", mode: 'cors'}
        )
    } catch (error) {
        console.error("server not reachable", error)
        throw new CannotConnectError("couldn't reach server")
    }
}