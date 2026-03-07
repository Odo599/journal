import {Modal, Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useEffect, useState} from "react";
import {DateTimePickerAndroid, DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {format} from "date-fns";

import styles from "@/styles/styles";
import DateTimeModalStyles from "@/styles/DateTimeModalStyles";
import ButtonNoBackground from "@/components/ButtonNoBackground";

type DateTimeModalProps = {
    initialTime: Date,
    onChange: (date: Date) => void,
    onClosePress: () => void
    visible: boolean
}

export function DateTimeModal({initialTime, onChange, onClosePress, visible}: DateTimeModalProps) {
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
        setDateText(format(date, "dd/MM/yy"))
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