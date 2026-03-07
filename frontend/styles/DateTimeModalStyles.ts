import {StyleSheet} from "react-native";
import {MD3Theme} from "react-native-paper";

const getDateTimeModalStyles = (theme: MD3Theme) => {
    return StyleSheet.create({
        menuBox: {
            minWidth: 300,
            borderRadius: 20,
            justifyContent: "center",
            padding: 30,
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.outline,
            borderWidth: 1
        },
        background: {
            backgroundColor: theme.colors.shadow
        }
    });
}

export default getDateTimeModalStyles;