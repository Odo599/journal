import {RefreshControl, SectionList, View} from "react-native"
import {useCallback, useEffect, useState} from "react";
import {useFocusEffect, useRouter} from "expo-router";
import {Text} from "react-native-paper"
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import {EntryType} from "@/types/EntryType";
import TopHeader from "@/components/TopHeader";
import getEntries from "@/lib/database/getEntries";
import ContextMenu from "@/components/ContextMenu";
import deleteEntry from "@/lib/database/deleteEntry";
import _ from "lodash";
import {MonthHeader} from "@/components/MonthHeader";
import DaySection from "@/components/DaySection";


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
                    router.navigate("/Welcome")
                } else {
                    console.error("error when updating entries ", error)
                    showStatus("there was an error when loading the entries, please reload or connect to wifi")
                }

            }
        }, [router]
    )

    const onRefresh = useCallback(async () => {
            setIsRefreshing(true)
            try {
                await updateEntries()
            } catch (error) {
                console.error("error while refreshing home page", error)
            } finally {
                setIsRefreshing(false)
            }
        }, [updateEntries]
    )

    const groupEntries = (entries: EntryType[]) => {
        const monthGroups = _.groupBy(entries, (e: EntryType) => {
            const d = new Date(e.created)
            return `${d.getFullYear()}-${d.getMonth()}`
        })

        return Object.entries(monthGroups).map(([monthKey, monthEntries]) => {
            const dayGroups = _.groupBy(monthEntries, (e: EntryType) => {
                const d = new Date(e.created)
                return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
            })

            const days = Object.entries(dayGroups).map(([day, dayEntries]) => ({
                title: day,
                data: dayEntries
            }))

            const [year, month] = monthKey.split("-").map(Number)
            const title = new Date(year, month).toLocaleString("en-US", {
                month: "long",
                year: "numeric"
            })

            return {
                title,
                data: days
            }
        })
    }

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
                <SectionList
                    sections={groupEntries(entries)}
                    renderItem={({item}) => (
                        <DaySection
                            daySection={item}
                            setMenuPosition={setMenuPosition}
                            setContextMenuVisible={setContextMenuVisible}
                            setCurrentEntry={setSelectedEntry}
                        />
                    )}
                    renderSectionHeader={({section: {title}}) => <MonthHeader month={title}/>}
                    ListHeaderComponent={TopHeader}
                    refreshing={isRefreshing}
                    refreshControl={<RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />}
                />
            </View>
            <ContextMenu
                visible={contextMenuVisible}
                setContextMenuVisible={setContextMenuVisible}
                position={menuPosition}
                anchor={{
                    horizontal: "left",
                    vertical: "top"
                }}
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
