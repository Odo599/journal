import {StyleSheet} from "react-native";
import {MD3Theme} from "react-native-paper";

const getStyles = (theme: MD3Theme) => {
    return StyleSheet.create({
        background: {
            backgroundColor: "#FFF"
        },
        fullWidthTextInput: {
            height: 40,
            borderColor: theme.colors.outlineVariant,
            color: theme.colors.onBackground,
            // backgroundColor: theme.colors.background,
            borderWidth: 2,
            borderRadius: 20,
            marginVertical: 7,
            paddingHorizontal: 15
        },
        fullWidthButton: {
            marginTop: 10
        },
        noBackgroundButton: {
            height: 40,
            justifyContent: "center",
            alignItems: "center"
        },
        centeredView: {
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        headerText: {
            textAlign: "center",
            margin: 10,
            fontFamily: "SourceSansPro_700Bold",
        },
        headingText: {
            fontSize: 30
        },
        smallHeading: {
            fontSize: 30
        },
        subtext: {
            textAlign: "center",
            fontSize: 15,
            marginBottom: 10
        },
        mainViewPadding: {
            padding: 20
        },
        linkText: {
            color: theme.colors.primary
        },
        alignRight: {
            marginLeft: "auto"
        }
    })
}

export default getStyles;

