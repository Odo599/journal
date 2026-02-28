// noinspection JSUnusedGlobalSymbols

import {useGlobalSearchParams, useNavigation, useRouter} from "expo-router";
import {Animated, Pressable, Text, View} from "react-native";
import {useCallback, useEffect, useRef, useState} from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {useKeyboardAnimation} from "react-native-keyboard-controller";
import {SafeAreaView} from "react-native-safe-area-context";

import CannotConnectError from "@/lib/errors/CannotConnectError";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import styles from "@/styles/styles"
import {EntryType, isEntry} from "@/types/EntryType";
import EntryEditorStyles from "@/styles/EntryEditorStyles";
import getEntry from "@/lib/database/getEntry";
import NoAvailableEntryError from "@/lib/errors/NoAvailableEntryError";
import putEntry from "@/lib/database/putEntry";
import saveLocalEntry from "@/lib/local/saveLocalEntry";


export default function EntryEditor() {
    const {offlineEntry, id} = useGlobalSearchParams<{ offlineEntry?: string, id: string }>();
    const router = useRouter()
    const navigation = useNavigation()

    const [loaded, setLoaded] = useState(false);
    const [entry, setEntry] = useState<EntryType>();
    const [errorText, setErrorText] = useState("");
    const [errorShown, setErrorShown] = useState(false);

    const editorRef = useRef<RichEditor>(null);

    const {height} = useKeyboardAnimation()

    function showError(text: string) {
        setErrorText(text);
        setErrorShown(true);
    }

    const getOffline = useCallback(() => {
        return offlineEntry === "true";
    }, [offlineEntry])

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back()
        } else {
            router.navigate("/")
        }
    }, [router])

    useEffect(() => {
        (async () => {
            if (Number.isNaN(Number(id))) {
                console.error("tried to navigate to entry with non integer id:", id)
                setTimeout(() => {
                    router.replace("/")
                }, 0)
            } else {
                try {
                    const entry = await getEntry(Number(id), getOffline())
                    if (isEntry(entry)) {
                        setEntry(entry)
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
    }, [getOffline, id, router])

    useEffect(() => {
        return navigation.addListener('beforeRemove', () => {
            if (entry !== undefined) {
                console.log("saving entry");
                (async () => {
                    try {
                        await putEntry(entry)
                    } catch (error) {
                        console.error("error while saving entry before leaving editor", error)
                    }
                })()
            }
        })
    }, [entry, getOffline, id, navigation]);

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
                            <Text style={EntryEditorStyles.title}>{entry?.created} {entry?.offline}</Text>
                        </View>
                        <View style={EntryEditorStyles.editor}>
                            <RichEditor
                                ref={editorRef}
                                initialContentHTML={entry?.body}
                                onChange={(text) => {
                                    if (entry !== null && entry !== undefined) {
                                        entry.body = text
                                        void saveLocalEntry(entry);
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
