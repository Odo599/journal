// noinspection JSUnusedGlobalSymbols

import FullWidthLink from "@/components/FullWidthLink";
import {useRouter} from 'expo-router';
import {ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, useTheme} from "react-native-paper";
import {useMemo} from "react";
import getMenuStyles from "@/styles/MenuStyles";
import getStyles from "@/styles/styles";

export default function Menu() {
    const theme = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])
    const MenuStyles = useMemo(() => getMenuStyles(theme), [theme])
    const router = useRouter();

    return (
        <SafeAreaView style={MenuStyles.view}>
            <Text style={styles.smallHeading}>Menu</Text>
            <ScrollView>
                <FullWidthLink
                    onPress={() => {
                        router.navigate("/CreateUser")
                    }}
                    text={"Create Account"}
                />
                <FullWidthLink
                    onPress={() => {
                        router.navigate("/Login")
                    }}
                    text={"Login"}
                />
            </ScrollView>
        </SafeAreaView>
    )
}