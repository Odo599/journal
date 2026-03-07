import {StyleSheet} from "react-native";

const getCreateEntryButtonStyles = () => {
    return StyleSheet.create({
        container: {
            position: "absolute",
            bottom: 15,
            right: 15,
            borderRadius: 20,
        }
    });
}

export default getCreateEntryButtonStyles;