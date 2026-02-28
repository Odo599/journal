import {FlatList, RefreshControl, Text, View} from "react-native"
import {useCallback, useEffect, useState} from "react";
import {useFocusEffect, useRouter} from "expo-router";

import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import Entry from "@/components/Entry";
import {EntryType} from "@/types/EntryType";
import TopHeader from "@/components/TopHeader";
import getEntries from "@/lib/database/getEntries";
import ContextMenu from "@/components/ContextMenu";
import deleteEntry from "@/lib/database/deleteEntry";


export default function EntriesView() {
    const router = useRouter()

    const [entries, setEntries] = useState<EntryType[]>([])
    const [statusText, setStatusText] = useState("")
    const [statusShown, setStatusShown] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [contextMenuVisible, setContextMenuVisible] = useState(false)
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0})
    const [selectedEntry, setSelectedEntry] = useState<EntryType>()

    function showStatus(text: string) {
        setStatusText(text)
        setStatusShown(true)
    }

    const updateEntries = useCallback(
        async () => {
            try {
                const entries = await getEntries()
                setEntries(entries)
            } catch (error) {
                if (error instanceof NotLoggedInError) {
                    console.error("can't display entries, redirecting to login");
                    router.navigate("/Login")
                } else {
                    console.log("error when updating entries ", error)
                    showStatus("there was an error when loading the entries, please reload or connect to wifi")
                }

            }
        }, [router]
    )

    const onRefresh = useCallback(async () => {
            console.log("refreshing home page")
            setIsRefreshing(true)
            try {
                await updateEntries()
                console.log("refreshed home page")
            } catch (error) {
                console.error("error while refreshing home page", error)
            } finally {
                setIsRefreshing(false)
            }
        }, [updateEntries]
    )

    useEffect(() => {
        void updateEntries()
    }, [router, updateEntries])

    useFocusEffect(
        useCallback(() => {
            void onRefresh();
        }, [onRefresh])
    );

    return (
        <>
            <View>
                {statusShown && <Text>{statusText}</Text>}

                <FlatList
                    data={entries.sort((a, b) => Date.parse(b.created) - Date.parse(a.created))}
                    keyExtractor={(item) => item.id.toString() + item.offline}
                    ListHeaderComponent={TopHeader}
                    refreshing={isRefreshing}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    renderItem={({item}) => (
                        <Entry
                            entry={item}
                            setContextMenuVisible={setContextMenuVisible}
                            setMenuPosition={setMenuPosition}
                            setCurrentEntry={setSelectedEntry}
                        />
                    )}
                />
            </View>
            <ContextMenu
                visible={contextMenuVisible}
                setContextMenuVisible={setContextMenuVisible}
                position={menuPosition}
                items={[
                    {
                        text: "Delete",
                        closeOnPress: true,
                        onPress: () => {
                            (async () => {
                                if (selectedEntry) {
                                    await deleteEntry(selectedEntry)
                                    await updateEntries()
                                }
                            })()

                        },
                        destructive: true
                    }
                ]}
            />
        </>
    );
}
