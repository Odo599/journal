import CannotConnectError from "@/lib/errors/CannotConnectError";
import backendHost from "@/lib/backend/backendHost";

export default async function checkOnline() {
    try {
        await fetch(
            `${backendHost}/health`,
            {method: "GET", mode: 'cors'}
        )
    } catch (error) {
        console.error("server not reachable", error)
        throw new CannotConnectError("couldn't reach server")
    }
}