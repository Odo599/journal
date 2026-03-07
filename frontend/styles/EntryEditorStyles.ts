import {StyleSheet} from "react-native";
import {MD3Theme} from "react-native-paper";

const getEntryEditorStyles = (theme: MD3Theme) => {
    return StyleSheet.create({
        editorView: {
            flex: 1,
            flexDirection: "column",
            backgroundColor: theme.colors.background
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10
        },
        backIcon: {
            marginRight: 15
        },

        title: {
            fontSize: 20
        },

        editor: {
            flex: 1
        },
        editorStyle: {
            backgroundColor: theme.colors.background,
            color: theme.colors.onBackground
        },
        toolbar: {
            backgroundColor: theme.colors.background
        }
    });
}

export default getEntryEditorStyles;