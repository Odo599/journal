// noinspection JSUnusedGlobalSymbols

import React, {useMemo} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import WelcomeStyles from "@/styles/WelcomeStyles";
import {SourceSansPro_700Bold, useFonts} from "@expo-google-fonts/source-sans-pro";
import {useRouter} from "expo-router";
import {useTheme, Text} from "react-native-paper";
import getStyles from "@/styles/styles";
import getOnboardingStyles from "@/styles/OnboardingStyles";
import FullWidthLink from "@/components/FullWidthLink";

export default function Welcome() {
    const theme = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])
    const OnboardingStyles = useMemo(() => getOnboardingStyles(theme), [theme])

    useFonts({
        SourceSansPro_700Bold,
    });

    const router = useRouter()

    return (
        <SafeAreaView style={OnboardingStyles.view}>
            <Text style={styles.headerText} variant={"displayLarge"}>Your journal</Text>
            <Text style={WelcomeStyles.infoText}>To get started, log in or create an account</Text>

            <FullWidthLink
                text={"Login"}
                onPress={() => router.navigate("/Login")}
            />
            <FullWidthLink
                text={"Create Account"}
                onPress={() => router.navigate("/CreateUser")}
            />
        </SafeAreaView>
    );
}