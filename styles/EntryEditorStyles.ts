import {StyleSheet} from "react-native";

const EntryEditorStyles = StyleSheet.create({
    editorView: {
        flex: 1,
        flexDirection: "column"
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

});

export default EntryEditorStyles;