import {StyleSheet} from "react-native";
import {MD3Theme} from "react-native-paper";

const getEntryStyles = (theme: MD3Theme) => {
    return StyleSheet.create({
        view: {
            marginHorizontal: 12,
            marginTop: 5,
            paddingBottom: 5
        },
        timestamp: {
            color: theme.colors.onSurface
        }
    })
}

export default getEntryStyles;