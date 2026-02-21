import {useLocalSearchParams, useRouter} from "expo-router";
import {View, Text, ScrollView, Pressable} from "react-native";
import {useEffect, useState} from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import getEntry from "@/lib/backend/getEntry";
import CannotConnectError from "@/lib/errors/CannotConnectError";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import styles from "@/styles/styles"
import {EntryType, isEntry} from "@/types/EntryType";
import EntryEditorStyles from "@/styles/EntryEditorStyles";

export default function EntryEditor() {
    const local = useLocalSearchParams();
    const router = useRouter()

    const [entry, setEntry] = useState<EntryType>()
    const [errorText, setErrorText] = useState("")
    const [errorShown, setErrorShown] = useState(false)

    function showError(text: string) {
        setErrorText(text);
        setErrorShown(true);
    }

    function goBack() {
        if (router.canGoBack()) {
            router.back()
        } else {
            router.navigate("/")
        }
    }

    useEffect(() => {
        (async () => {
            if (Number.isNaN(Number(local.id))) {
                console.error("tried to navigate to entry with non integer id:", local.id)
                setTimeout(() => {
                    router.replace("/")
                }, 0)
            } else {
                try {
                    const response = await getEntry(Number(local.id));
                    const entry = await response.json()
                    if (isEntry(entry)) {
                        setEntry(entry)
                    }
                } catch (error) {
                    if (error instanceof CannotConnectError) {
                        console.error("couldn't display entry in editor, not connected")
                        showError("Couldn't connect to server, please retry or connect to internet.")
                    } else if (error instanceof NotLoggedInError) {
                        console.error("not logged in, redirecting to login")
                        router.navigate("/Login")
                    } else {
                        console.error("an unknown error occurred when displaying the editor", error)
                    }
                }
            }
        })()
    }, [local.id, router])

    return (
        <>
            {errorShown &&
                <View style={styles.centeredView}>
                    <Text>{errorText}</Text>
                </View>
            }
            <View>
                <View style={EntryEditorStyles.header}>
                    <Pressable onPress={goBack}>
                        <MaterialIcons
                            name="arrow-back"
                            size={30} color="black"
                            style={EntryEditorStyles.backIcon}/>
                    </Pressable>
                    <Text style={EntryEditorStyles.title}>{entry?.created}</Text>
                </View>
                <ScrollView>
                    <Text>
                        {entry?.body}
                    </Text>
                </ScrollView>

            </View>
        </>
    )
}