import CannotConnectError from "@/lib/errors/CannotConnectError";

export default async function checkOnline() {
    try {
        await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/health`,
            {method: "GET", mode: 'cors'}
        )
    } catch {
        throw new CannotConnectError("couldn't reach server")
    }
}