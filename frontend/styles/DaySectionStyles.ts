import {StyleSheet} from "react-native";

const getDaySectionStyles = () => {
    return StyleSheet.create({
        view: {
            display: "flex",
            flexDirection: "row",
        },
        textContainer: {
            minWidth: 70,
            height: 70,
            alignItems: "center",
            justifyContent: "center"
        },
        entriesContainer: {
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        }
    })
}

export default getDaySectionStyles;