import {View} from "react-native";
import {useFonts, SourceSansPro_700Bold} from '@expo-google-fonts/source-sans-pro';
import {Text, useTheme} from "react-native-paper";
import getTopHeaderStyles from "@/styles/TopHeaderStyles";
import {useMemo} from "react";

export default function TopHeader() {
    const theme = useTheme()
    const TopHeaderStyles = useMemo(() => getTopHeaderStyles(theme), [theme])

    let [fontsLoaded] = useFonts({
        SourceSansPro_700Bold,
    });


    if (!fontsLoaded) {
        return <Text>Loading...</Text>
    }
    return <View style={TopHeaderStyles.topHeader}>
        <Text style={TopHeaderStyles.topHeaderTitle}>Journal</Text>
    </View>
}