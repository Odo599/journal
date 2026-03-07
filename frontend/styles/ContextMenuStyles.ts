import {StyleSheet} from "react-native";
import {MD3Theme} from "react-native-paper";

const getContextMenuStyles = (theme: MD3Theme) => {
    return StyleSheet.create({
        overlay: {
            flex: 1
        },
        menu: {
            position: "absolute",
            backgroundColor: theme.colors.surface,
            minHeight: 30,
            width: 150,
            borderRadius: 10,
            borderColor: theme.colors.outline,
            borderWidth: 1.5
        },
        item: {
            minHeight: 30,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            borderBottomColor: theme.colors.outline,
        },
        itemNotLast: {
            borderBottomWidth: 1.5
        },
        itemLast: {},
        itemTextDestructive: {
            color: theme.colors.error
        }
    });
}

export default getContextMenuStyles;