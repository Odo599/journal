// noinspection JSUnusedGlobalSymbols

import {useGlobalSearchParams, useNavigation, useRouter} from "expo-router";
import {Animated, Pressable, View} from "react-native";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {useKeyboardAnimation} from "react-native-keyboard-controller";
import {SafeAreaView} from "react-native-safe-area-context";
import {format} from "date-fns";
import {useTheme, Text} from "react-native-paper";
import CannotConnectError from "@/lib/errors/CannotConnectError";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import {EntryType, isEntry} from "@/types/EntryType";
import getEntryEditorStyles from "@/styles/EntryEditorStyles";
import getEntry from "@/lib/database/getEntry";
import NoAvailableEntryError from "@/lib/errors/NoAvailableEntryError";
import putEntry from "@/lib/database/putEntry";
import saveLocalEntry from "@/lib/local/saveLocalEntry";
import ContextMenu from "@/components/ContextMenu";
import deleteEntry from "@/lib/database/deleteEntry";
import {DateTimeModal} from "@/components/DateTimeModal";
import getStyles from "@/styles/styles";


export default function EntryEditor() {
    const theme = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])
    const {offlineEntry, id} = useGlobalSearchParams<{ offlineEntry?: string, id: string }>();
    const router = useRouter()
    const navigation = useNavigation()
    const EntryEditorStyles = useMemo(() => getEntryEditorStyles(theme), [theme])

    const [loaded, setLoaded] = useState(false);
    const [entry, setEntry] = useState<EntryType>();
    const [errorText, setErrorText] = useState("");
    const [errorShown, setErrorShown] = useState(false);
    const [dateText, setDateText] = useState("")
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0})
    const [datetimeMenuVisible, setDatetimeMenuVisible] = useState(false)

    const editorRef = useRef<RichEditor>(null);
    const richToolbarContainerRef = useRef<View>(null)

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

    const showMenu = useCallback(() => {
        if (richToolbarContainerRef.current !== null) {
            richToolbarContainerRef.current.measure((_x, _y, _width, _height, _pageX, pageY) => {
                setMenuPosition({x: 0, y: pageY - 10})
                setMenuVisible(true)

            })
        }

    }, [])

    const updateEntry = useCallback(() => {
        if (entry !== undefined) {
            console.log("saving entry");
            (async () => {
                try {
                    await putEntry(entry)
                } catch (error) {
                    console.error("error while saving entry", error)
                }
            })()
        }
    }, [entry])

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
        return navigation.addListener('beforeRemove', updateEntry)
    }, [entry, getOffline, id, navigation, updateEntry]);

    useEffect(() => {
        if (entry?.created) {
            const created = new Date(Date.parse(entry.created))
            setDateText(format(created, "E, do 'of' MMMM, HH:mm"))
        }
    }, [entry?.created]);

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
                                    size={30} color={theme.colors.onBackground}
                                    style={EntryEditorStyles.backIcon}/>
                            </Pressable>
                            <Text style={EntryEditorStyles.title}>{dateText}</Text>
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
                                editorStyle={EntryEditorStyles.editorStyle}
                            />
                        </View>
                        <Animated.View
                            style={{
                                transform: [{translateY: height}],
                            }}
                        >
                            <View ref={richToolbarContainerRef}>
                                <RichToolbar
                                    editor={editorRef}
                                    actions={[
                                        "menu",
                                        actions.undo,
                                        actions.redo,
                                        actions.setBold,
                                        actions.setItalic,
                                        actions.setStrikethrough,
                                        actions.setUnderline,
                                        actions.insertBulletsList,
                                        actions.insertOrderedList,
                                        actions.checkboxList,
                                        actions.removeFormat,
                                        actions.code,
                                    ]}
                                    iconMap={{
                                        "menu": () => <MaterialIcons name="menu" size={24}
                                                                     color={theme.colors.onBackground}/>
                                    }}
                                    menu={showMenu}
                                    iconTint={theme.colors.onBackground}
                                    selectedIconTint={theme.colors.primary}
                                    style={EntryEditorStyles.toolbar}
                                />
                            </View>
                        </Animated.View>
                    </SafeAreaView>

                </>}
            <ContextMenu
                visible={menuVisible}
                setContextMenuVisible={setMenuVisible}
                position={menuPosition}
                anchor={{
                    horizontal: "left",
                    vertical: "bottom"
                }}
                items={[
                    {
                        text: "Delete",
                        closeOnPress: true,
                        destructive: true,
                        onPress: () => {
                            (async () => {
                                if (entry) {
                                    await deleteEntry(entry)
                                    router.navigate("/")
                                }
                            })()
                        },
                    },
                    {
                        text: "Edit date",
                        closeOnPress: true,
                        onPress: () => setDatetimeMenuVisible(true)
                    }
                ]}
            />
            {entry && (
                <DateTimeModal
                    initialTime={new Date(entry.created)}
                    onChange={(date) => {
                        setEntry((e) => {
                            if (e !== undefined) {
                                e.created = date.toString()
                                return e
                            } else {
                                console.warn("changed date with a non initialised entry")
                                return undefined
                            }
                        })
                        updateEntry()
                    }}
                    onClosePress={() => setDatetimeMenuVisible(false)}
                    visible={datetimeMenuVisible}
                />)
            }
        </View>
    )
}
