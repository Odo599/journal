import {useLocalSearchParams, useRouter} from "expo-router";
import {View, Text, Pressable, Animated} from "react-native";
import {useEffect, useRef, useState} from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {useKeyboardAnimation} from "react-native-keyboard-controller";

import getEntry from "@/lib/backend/getEntry";
import CannotConnectError from "@/lib/errors/CannotConnectError";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import styles from "@/styles/styles"
import {EntryType, isEntry} from "@/types/EntryType";
import EntryEditorStyles from "@/styles/EntryEditorStyles";
import {SafeAreaView} from "react-native-safe-area-context";


export default function EntryEditor() {
    const local = useLocalSearchParams();
    const router = useRouter()

    const [loaded, setLoaded] = useState(false);
    const [entry, setEntry] = useState<EntryType>();
    const [errorText, setErrorText] = useState("");
    const [errorShown, setErrorShown] = useState(false);

    const editorRef = useRef<RichEditor>(null);

    const {height, progress} = useKeyboardAnimation()

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
                        setLoaded(true)
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
        <View style={{flex: 1}}>
            {errorShown &&
                <SafeAreaView>
                    <View style={styles.centeredView}>
                        <Text>{errorText}</Text>
                    </View>
                </SafeAreaView>
            }
            {loaded &&
                (<>

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
                                    console.log(text)
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

                </>)}
        </View>
    )
}