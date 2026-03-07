import {StyleSheet} from "react-native";
import {MD3Theme} from "react-native-paper";

const getFullWidthLinkStyles = (theme: MD3Theme) => {
    return StyleSheet.create({
        view: {
            height: 40,
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: theme.colors.outline,
            borderRadius: 9,
            paddingLeft: 15,
            paddingRight: 10,
            marginTop: 10,
            marginBottom: 10,
            display: "flex",
            flexDirection: "row",
        },
        arrow: {
            marginLeft: "auto"
        }
    });
}

export default getFullWidthLinkStyles;