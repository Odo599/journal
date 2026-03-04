import {StyleSheet} from "react-native";

const FullWidthLinkStyles = StyleSheet.create({
    view: {
        height: 40,
        alignItems:"center",
        borderWidth: 1.5,
        borderColor: "grey",
        borderRadius: 9,
        paddingLeft: 15,
        paddingRight: 10,
        margin: 10,
        display: "flex",
        flexDirection: "row",
    },
    arrow: {
        marginLeft: "auto"
    }
});

export default FullWidthLinkStyles;