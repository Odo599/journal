import {Pressable, Vibration, View} from "react-native";
import {useRouter} from "expo-router";
import React, {memo, useEffect, useMemo, useState} from 'react';
import getEntryStyles from "@/styles/EntryStyles";
import Html from "@/components/Html";
import {EntryType} from "@/types/EntryType";
import {format} from "date-fns";
import {useTheme, Text} from "react-native-paper";

type EntryProps = {
    entry: EntryType,
    setContextMenuVisible?: (arg0: boolean) => void,
    setMenuPosition?: (arg0: { x: number, y: number }) => void,
    setCurrentEntry?: (arg0: EntryType) => void
}

function Entry({entry, setContextMenuVisible, setMenuPosition, setCurrentEntry}: EntryProps) {
    const router = useRouter()
    const theme = useTheme()
    const EntryStyles = useMemo(() => getEntryStyles(theme), [theme])

    const [timeText, setTimeText] = useState("")

    useEffect(() => {
        const created = new Date(Date.parse(entry.created))
        setTimeText(format(created, "HH:mm"))
    }, [entry.created]);

    return (
        <>
            <Pressable
                onPress={() => {
                    router.navigate(`/entry/${entry.id}${(entry.offline && "?offlineEntry=true") || ""}`)
                }}
                onLongPress={(event) => {
                    const {pageX, pageY} = event.nativeEvent
                    if (setContextMenuVisible) {
                        Vibration.vibrate(1)
                        setContextMenuVisible(true)
                    }
                    if (setMenuPosition) setMenuPosition({x: pageX, y: pageY})
                    if (setCurrentEntry) setCurrentEntry(entry)
                }}
            >
                <View style={EntryStyles.view}>
                    <Html html={entry.body}/>
                    <Text style={EntryStyles.timestamp}>{timeText}</Text>
                </View>
            </Pressable>
        </>
    );
}

export default memo(Entry);