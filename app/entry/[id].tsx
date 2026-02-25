// noinspection JSUnusedGlobalSymbols

import {useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import {Animated, Pressable, Text, View} from "react-native";
import {useCallback, useEffect, useRef, useState} from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {useKeyboardAnimation} from "react-native-keyboard-controller";

import CannotConnectError from "@/lib/errors/CannotConnectError";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import styles from "@/styles/styles"
import {EntryType, isEntry} from "@/types/EntryType";
import EntryEditorStyles from "@/styles/EntryEditorStyles";
import {SafeAreaView} from "react-native-safe-area-context";
import saveEntry from "@/lib/database/saveEntry";
import getRecentEntry from "@/lib/database/getRecentEntry";
import NoAvailableEntryError from "@/lib/errors/NoAvailableEntryError";
import putEntry from "@/lib/backend/putEntry";


export default function EntryEditor() {
    const local = useLocalSearchParams();
    const router = useRouter()
    const navigation = useNavigation()

    const [loaded, setLoaded] = useState(false);
    const [entry, setEntry] = useState<EntryType>();
    const [errorText, setErrorText] = useState("");
    const [errorShown, setErrorShown] = useState(false);
    const [currentContent, setCurrentContent] = useState("");

    const editorRef = useRef<RichEditor>(null);

    const {height} = useKeyboardAnimation()

    function showError(text: string) {
        setErrorText(text);
        setErrorShown(true);
    }

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back()
        } else {
            router.navigate("/")
        }
    }, [router])

    useEffect(() => {
        (async () => {
            if (Number.isNaN(Number(local.id))) {
                console.error("tried to navigate to entry with non integer id:", local.id)
                setTimeout(() => {
                    router.replace("/")
                }, 0)
            } else {
                try {
                    const entry = await getRecentEntry(Number(local.id))
                    if (isEntry(entry)) {
                        setEntry(entry)
                        setCurrentContent(entry.body)
                        setLoaded(true)
                    }
                } catch (error) {
                    if (error instanceof CannotConnectError || error instanceof NoAvailableEntryError) {
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

    useEffect(() => {
        return navigation.addListener('beforeRemove', () => {
            if (entry !== undefined) {
                console.log("saving entry");
                (async () => {
                    try {
                        console.log("currentContent:", currentContent)
                        await saveEntry(Number(local.id), currentContent, entry.created, entry.author_username)
                        const recentEntry = await getRecentEntry(Number(local.id))
                        console.log("recentEntry", recentEntry)
                        await putEntry(recentEntry.id, recentEntry.body)
                    } catch (error) {
                        console.error("error while saving entry before leaving editor", error)
                    }
                })()
            }
        })
    }, [currentContent, entry, local.id, navigation]);

    return (
        <View style={{flex: 1}}>
            {errorShown &&
                <SafeAreaView>
                    <View style={styles.centeredView}>
                        <Text>{errorText}</Text>
                    </View>
                </SafeAreaView>
            }
            {loaded &&
                <>

                    <SafeAreaView style={EntryEditorStyles.editorView}>
                        <View style={EntryEditorStyles.header}>
                            <Pressable onPress={goBack}>
                                <MaterialIcons
                                    name="arrow-back"
                                    size={30} color="black"
                                    style={EntryEditorStyles.backIcon}/>
                            </Pressable>
                            <Text style={EntryEditorStyles.title}>{entry?.created}</Text>
                        </View>
                        <View style={EntryEditorStyles.editor}>
                            <RichEditor
                                ref={editorRef}
                                initialContentHTML={entry?.body}
                                onChange={(text) => {
                                    setCurrentContent(text)
                                    if (entry?.id !== undefined) {
                                        void saveEntry(entry.id, text, entry.created, entry.author_username);
                                    } else {
                                        console.warn("Entry was edited prior to id being available.")
                                    }
                                }}
                                style={{flex: 1}}

                            />
                        </View>
                        <Animated.View
                            style={{
                                transform: [{translateY: height}],
                            }}
                        >
                            <RichToolbar
                                editor={editorRef}
                            />
                        </Animated.View>
                    </SafeAreaView>

                </>}
        </View>
    )
}
