import {StyleSheet} from "react-native";

const ContextMenuStyles = StyleSheet.create({
    overlay: {
        flex: 1
    },
    menu: {
        position: "absolute",
        backgroundColor: "black",
        minHeight: 30,
        width: 150,
        borderRadius: 10
    },
    item: {
        minHeight: 30,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: "white",
    },
    itemNotLast: {
        borderBottomWidth: 2
    },
    itemLast: {},
    itemText: {
        color: "white"
    },
    itemTextDestructive: {
        color: "red"
    }
})

export default ContextMenuStyles;