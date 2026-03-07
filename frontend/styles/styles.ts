import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#FFF"
    },
    fullWidthTextInput: {
        height: 40,
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 20,
        marginVertical: 7,
        paddingHorizontal: 15
    },
    fullWidthButton: {
        height: 40,
        backgroundColor: "#cc6eb1",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
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
    bigHeaderText: {
        fontSize: 60,
        textAlign: "center",
        margin: 10,
        fontFamily: "SourceSansPro_700Bold",
    },
    mediumHeaderText: {
        fontSize: 50,
        textAlign: "center",
        margin: 10,
        fontFamily: "SourceSansPro_700Bold",
    },
    headingText: {
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
        color: "#1a73e8"
    },
    alignRight: {
        marginLeft: "auto"
    }
})
export default styles;

