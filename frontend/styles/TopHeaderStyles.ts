import {StyleSheet} from "react-native";
import {MD3Theme} from "react-native-paper";

const getTopHeaderStyles = (theme: MD3Theme) => {
    return StyleSheet.create({
        topHeader: {
            height: 100,
            padding: 17.5,
            borderColor: theme.colors.outline,
            borderWidth: 2,
            margin: 10,
            borderRadius: 20
        },
        topHeaderTitle: {
            fontSize: 50,
            fontWeight: 700,
            fontFamily: "SourceSansPro_700Bold"
        },
    })
}


export default getTopHeaderStyles;