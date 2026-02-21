import {Text, View} from "react-native"
import {useEffect, useState} from "react";
import getEntries from "@/lib/backend/getEntries";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import {useRouter} from "expo-router";
import Entry from "@/components/Entry";
import {EntryType, isEntry} from "@/types/EntryType";


export default function EntriesView() {
    const router = useRouter()

    const [entries, setEntries] = useState<EntryType[]>([])
    const [statusText, setStatusText] = useState("")
    const [statusShown, setStatusShown] = useState(false)

    function showStatus(text: string) {
        setStatusText(text)
        setStatusShown(true)
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await getEntries()
                const body = await response.json()
                if (Array.isArray(body) && body.every(isEntry)) {
                    setEntries(body)
                } else {
                    console.error("entries response was invalid", body)
                    showStatus("Entries were malformed, please reload")
                }
            } catch (error) {
                if (error instanceof NotLoggedInError) {
                    console.error("can't display entries, redirecting to login");
                    router.navigate("/Login")
                }
            }
        })()
    }, [router])

    return (
        <View>
            {statusShown && <Text>{statusText}</Text>}
            {entries.map((entry) => (
                <Entry
                    body={entry.body}
                    created={entry.created}
                    id={entry.id}
                    key={entry.id}/>
            ))}
        </View>
    );
}