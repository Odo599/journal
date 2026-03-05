// noinspection JSUnusedGlobalSymbols

import {ScrollView, Text, View} from "react-native";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";

import FullWidthButton from "@/components/FullWidthButton";
import WelcomeStyles from "@/styles/WelcomeStyles";
import {SourceSansPro_700Bold, useFonts} from "@expo-google-fonts/source-sans-pro";
import {useRouter} from "expo-router";
import styles from "@/styles/styles";

export default function Welcome() {
    useFonts({
        SourceSansPro_700Bold,
    });

    const router = useRouter()

    return (
        <SafeAreaView>
            <ScrollView style={styles.mainViewPadding}>
                <Text style={styles.bigHeaderText}>Your journal</Text>
                <Text style={WelcomeStyles.infoText}>To get started, log in or create an account</Text>

                <FullWidthButton
                    text={"Login"}
                    onPress={() => router.navigate("/Login")}
                />
                <View style={{marginTop: 30}}/>
                <FullWidthButton
                    text={"Create Account"}
                    onPress={() => router.navigate("/CreateUser")}
                />
            </ScrollView>
        </SafeAreaView>
    );
}