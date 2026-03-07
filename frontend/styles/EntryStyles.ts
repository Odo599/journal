import {StyleSheet} from "react-native";
import {MD3Theme} from "react-native-paper";

const getEntryStyles = (theme: MD3Theme) => {
    return StyleSheet.create({
        view: {
            marginHorizontal: 12,
            marginTop: 5,
            borderBottomWidth: 1.7,
            borderColor: theme.colors.outline,
            paddingBottom: 5
        },
        body: {
            fontSize: 16
        },
        timestamp: {
            fontSize: 12,
            color: theme.colors.onSurface
        }
    })
}

export default getEntryStyles;