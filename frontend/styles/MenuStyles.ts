import {StyleSheet} from "react-native";
import {MD3Theme} from "react-native-paper";

const getMenuStyles = (theme: MD3Theme) => {
    return StyleSheet.create({
        view: {
            backgroundColor: theme.colors.background,
            flex: 1,
            padding: 10
        }
    })
}

export default getMenuStyles;