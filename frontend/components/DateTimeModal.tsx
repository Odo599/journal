import {Modal, Pressable, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useCallback, useEffect, useMemo, useState} from "react";
import {format} from "date-fns";
import {useTheme, Text} from "react-native-paper";
import getStyles from "@/styles/styles";
import getDateTimeModalStyles from "@/styles/DateTimeModalStyles";
import ButtonNoBackground from "@/components/ButtonNoBackground";
import {TimePickerModal, DatePickerModal} from "react-native-paper-dates";
import {SingleChange} from "react-native-paper-dates/src/Date/Calendar";

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
    const [timePickerVisible, setTimePickerVisible] = useState(false)
    const [datePickerVisible, setDatePickerVisible] = useState(false)

    const onTimeSave = ({hours, minutes}: { hours: number, minutes: number }) => {
        const newDate = date;
        newDate.setHours(hours, minutes);
        setDate(newDate);
        onChange(newDate);
        setTimePickerVisible(false);
        updateText()
    }

    const onDateSave = (params: { date: Date; }) => {
        setDate(params.date)
        onChange(params.date)
        setDatePickerVisible(false)
        updateText()
    }


    const showDatepicker = () => setDatePickerVisible(true);
    const showTimepicker = () => setTimePickerVisible(true);

    const updateText = useCallback(() => {
        setDateText(format(date, "ccc, do 'of' MMMM, yyyy"))
        setTimeText(format(date, "HH:mm"))
    }, [date])

    useEffect(updateText, [updateText, date]);

    return (
        <Modal
            visible={visible}
            backdropColor={"rgba(90,90,90,0.05)"}
            animationType={"fade"}
            onRequestClose={onClosePress}
        >
            <TimePickerModal
                visible={timePickerVisible}
                onDismiss={() => setTimePickerVisible(false)}
                onConfirm={onTimeSave}
                hours={date.getHours()}
                minutes={date.getMinutes()}
                use24HourClock={true}
                animationType={"fade"}
            />
            <DatePickerModal
                locale={"en-GB"}
                mode="single"
                visible={datePickerVisible}
                onDismiss={() => setDatePickerVisible(false)}
                date={date}
                onConfirm={(onDateSave as SingleChange)}
            />
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