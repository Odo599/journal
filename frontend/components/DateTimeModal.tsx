import {Modal, Pressable, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useEffect, useMemo, useState} from "react";
import {DateTimePickerAndroid, DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {format} from "date-fns";
import {useTheme, Text} from "react-native-paper";
import getStyles from "@/styles/styles";
import getDateTimeModalStyles from "@/styles/DateTimeModalStyles";
import ButtonNoBackground from "@/components/ButtonNoBackground";

type DateTimeModalProps = {
    initialTime: Date,
    onChange: (date: Date) => void,
    onClosePress: () => void
    visible: boolean
}

export function DateTimeModal({initialTime, onChange, onClosePress, visible}: DateTimeModalProps) {
    const theme = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])
    const DateTimeModalStyles = useMemo(() => getDateTimeModalStyles(theme), [theme])

    const [date, setDate] = useState(initialTime);
    const [dateText, setDateText] = useState("")
    const [timeText, setTimeText] = useState("")

    const internalOnChange = (_event: DateTimePickerEvent, date?: Date | undefined) => {
        if (date !== undefined) {
            setDate(date);
            onChange(date);
        }
    };

    const showMode = (currentMode: "date" | "time") => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: internalOnChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => showMode('date');
    const showTimepicker = () => showMode('time');

    useEffect(() => {
        setDateText(format(date, "ccc, do 'of' MMMM, yyyy"))
    }, [date]);

    useEffect(() => {
        setTimeText(format(date, "HH:mm"))
    }, [date]);


    return (
        <Modal
            visible={visible}
            backdropColor={"rgba(90,90,90,0.05)"}
            animationType={"fade"}
            onRequestClose={onClosePress}
        >
            <Pressable onPress={onClosePress} style={{flex: 1}}>
                <SafeAreaView style={[styles.centeredView, {flex: 1}]}>
                    <View style={DateTimeModalStyles.menuBox}>
                        <Text style={styles.headingText}>Edit date</Text>
                        <ButtonNoBackground onPress={showDatepicker} text={dateText} style={styles.alignRight}/>
                        <ButtonNoBackground onPress={showTimepicker} text={timeText} style={styles.alignRight}/>
                        <ButtonNoBackground onPress={onClosePress} text={"Close"} style={styles.alignRight}/>
                    </View>
                </SafeAreaView>
            </Pressable>
        </Modal>
    );
}