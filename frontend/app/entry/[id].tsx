// noinspection JSUnusedGlobalSymbols

import {useGlobalSearchParams, useNavigation, useRouter} from "expo-router";
import {Animated, FlatList, Pressable, View} from "react-native";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {useKeyboardAnimation} from "react-native-keyboard-controller";
import {SafeAreaView} from "react-native-safe-area-context";
import {format} from "date-fns";
import {Text, useTheme, Snackbar} from "react-native-paper";
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
import {launchImageLibrary} from "react-native-image-picker";
import uuid from "react-native-uuid";
import EntryImage from "@/components/EntryImage";
import addImage from "@/lib/database/addImage";
import deleteImage from "@/lib/database/deleteImage";

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
    const [addImageButtonEnabled, setAddImageButtonEnabled] = useState(true)
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [snackbarText, setSnackbarText] = useState("")
    const [imageMenuVisible, setImageMenuVisible] = useState(false)
    const [imageMenuPosition, setImageMenuPosition] = useState({x: 0, y: 0})
    const [currentImage, setCurrentImage] = useState<string>()

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
            (async () => {
                try {
                    await putEntry(entry)
                } catch (error) {
                    console.error("error while saving entry", error)
                }
            })()
        }
    }, [entry])

    const refreshEntry = useCallback(async () => {
        try {
            const entry = await getEntry(id, getOffline())
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
    }, [getOffline, id, router])


    const onAddImagePressed = () => {
        if (addImageButtonEnabled) {
            setAddImageButtonEnabled(false);
            (async () => {
                const response = await launchImageLibrary({
                    selectionLimit: 1,
                    mediaType: "photo",
                    includeBase64: false
                })

                if (response.errorCode === "permission") {
                    setSnackbarVisible(true)
                    setSnackbarText("Couldn't access your images")
                }
                setAddImageButtonEnabled(true);
                if (response.assets) {
                    if (response.assets[0].uri && entry) {
                        const id = uuid.v4()
                        const updatedEntry = await addImage(response.assets[0].uri, id, entry)
                        setEntry((e) => {
                            console.log("updating entry with ", e)
                            if (e) {
                                e.image_ids = updatedEntry.image_ids
                            }
                            return e
                        })
                    }
                }
            })()
        } else {
            console.warn("image button pressed when not allowed")
        }
    }

    const onDeleteImage = () => {
        if (currentImage) {
            deleteImage(currentImage)
                .then(() => {
                    void refreshEntry()
                })
        }
    }

    useEffect(() => {
        void refreshEntry()
    }, [refreshEntry, id])

    useEffect(() => {
        return navigation.addListener('beforeRemove', updateEntry)
    }, [entry, getOffline, id, navigation, updateEntry]);

    useEffect(() => {
        if (entry?.created) {
            setDateText(format(entry.created, "E, do 'of' MMMM, HH:mm"))
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
                            {/* --- HEADER ---*/}
                            <Pressable onPress={goBack}>
                                <MaterialIcons
                                    name="arrow-back"
                                    size={30} color={theme.colors.onBackground}
                                    style={EntryEditorStyles.backIcon}/>
                            </Pressable>
                            <Text style={EntryEditorStyles.title}>{dateText}</Text>
                        </View>
                        <FlatList
                            ListHeaderComponent={(
                                // --- EDITOR ---
                                <View style={EntryEditorStyles.editorView}>
                                    <View style={{borderWidth: 2, borderColor: "transparent"}}>
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
                                            editorStyle={EntryEditorStyles.editorStyle}
                                        />
                                    </View>
                                </View>)}
                            data={entry?.image_ids}
                            renderItem={(i) => (
                                <EntryImage
                                    id={i.item}
                                    setMenuPosition={setImageMenuPosition}
                                    setMenuVisible={setImageMenuVisible}
                                    setCurrentImage={setCurrentImage}
                                />)}
                            style={{flex: 1}}
                        />
                        {/* --- TOOLBAR --- */}
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
                                        actions.insertImage,
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
                                    onPressAddImage={onAddImagePressed}
                                    menu={showMenu}
                                    iconTint={theme.colors.onBackground}
                                    selectedIconTint={theme.colors.primary}
                                    style={EntryEditorStyles.toolbar}
                                />
                            </View>
                        </Animated.View>
                    </SafeAreaView>

                </>}
            {/* --- MAIN CONTEXT MENU --- */}
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
            {/* --- IMAGE CONTEXT MENU --- */}
            <ContextMenu
                visible={imageMenuVisible}
                setContextMenuVisible={setImageMenuVisible}
                position={imageMenuPosition}
                items={[
                    {
                        text: "Delete",
                        destructive: true,
                        closeOnPress: true,
                        onPress: onDeleteImage
                    }
                ]}
                anchor={{horizontal: "right", vertical: "top"}}
            />
            {/* --- DATE EDITOR --- */}
            {entry && (
                <DateTimeModal
                    initialTime={new Date(entry.created)}
                    onChange={(date) => {
                        setEntry((e) => {
                            if (e !== undefined) {
                                e.created = date
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
            {/* --- Error Snackbar --- */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}>
                {snackbarText}
            </Snackbar>
        </View>
    )
}
