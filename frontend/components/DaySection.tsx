import {Divider, Text} from "react-native-paper";
import Entry from "@/components/Entry";
import {FlatList, View} from "react-native";
import {EntryType} from "@/types/EntryType";
import {useMemo} from "react";
import getDaySectionStyles from "@/styles/DaySectionStyles";
import {format} from "date-fns";

type DaySectionProps = {
    daySection: {
        title: string
        data: EntryType[],
    },
    setContextMenuVisible: (arg0: boolean) => void,
    setMenuPosition: (arg0: { x: number, y: number }) => void,
    setCurrentEntry: (arg0: EntryType) => void,
}

export default function DaySection({
                                       daySection,
                                       setContextMenuVisible,
                                       setMenuPosition,
                                       setCurrentEntry
                                   }: DaySectionProps) {
    const DaySectionStyles = useMemo(() => getDaySectionStyles(), [])

    const formatDate = (dstr: string) => {
        const date = new Date(Date.parse(dstr))
        return (<>
            <Text variant={"headlineSmall"}>{format(date, "d")}</Text>
            <Text variant={"labelMedium"}>{format(date, "iii")}</Text>
        </>)
    }


    return (
        <View>
            <View style={DaySectionStyles.view}>
                <View style={DaySectionStyles.textContainer}>
                    {formatDate(daySection.title)}
                </View>
                <View style={[
                    DaySectionStyles.entriesContainer,
                    daySection.data.length !== 1 ? {paddingBottom: 10} : {}
                ]}>
                    <FlatList
                        data={daySection.data.sort((a, b) => b.created.valueOf() - a.created.valueOf())}
                        renderItem={({item, index}) => {
                            return <Entry
                                entry={item}
                                showDivider={daySection.data.length !== index + 1}
                                setCurrentEntry={setCurrentEntry}
                                setContextMenuVisible={setContextMenuVisible}
                                setMenuPosition={setMenuPosition}
                            />

                        }}
                        scrollEnabled={false}
                        style={{flex: 1}}
                    />
                </View>
            </View>
            <Divider/>
        </View>
    );
}