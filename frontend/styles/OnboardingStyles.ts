import {StyleSheet} from "react-native";
import {MD3Theme} from "react-native-paper";

const getOnboardingStyles = (theme: MD3Theme) => {
    return StyleSheet.create({
        view: {
            padding: 20,
            backgroundColor: theme.colors.background,
            flex: 1
        },
    });
}

export default getOnboardingStyles;