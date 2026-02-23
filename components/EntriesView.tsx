import {FlatList, Text, View} from "react-native"
import {useCallback, useEffect, useState} from "react";
import {useRouter} from "expo-router";

import getEntries from "@/lib/backend/getEntries";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import Entry from "@/components/Entry";
import {EntryType, isEntry} from "@/types/EntryType";
import TopHeader from "@/components/TopHeader";


export default function EntriesView() {
    const router = useRouter()

    const [entries, setEntries] = useState<EntryType[]>([])
    const [statusText, setStatusText] = useState("")
    const [statusShown, setStatusShown] = useState(false)

    function showStatus(text: string) {
        setStatusText(text)
        setStatusShown(true)
    }

    const updateEntries = useCallback(
        async () => {
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
        }, [router]
    )

    useEffect(() => {
        void updateEntries()
    }, [router, updateEntries])

    return (
        <View>
            {statusShown && <Text>{statusText}</Text>}

            <FlatList
                data={entries}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={TopHeader}
                renderItem={({item}) => (
                    <Entry
                        id={item.id}
                        body={item.body}
                        created={item.created}
                    />
                )}
            />
        </View>
    );
}