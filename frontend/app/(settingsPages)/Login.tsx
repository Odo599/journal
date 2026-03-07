// noinspection JSUnusedGlobalSymbols

import {View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useMemo} from "react";
import FullWidthTextInput from "@/components/FullWidthTextInput";
import FullWidthButton from "@/components/FullWidthButton";
import login from "@/lib/backend/login";
import CannotConnectError from "@/lib/errors/CannotConnectError";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link, useRouter} from "expo-router";
import {useTheme, Text} from "react-native-paper";
import getStyles from "@/styles/styles";
import getOnboardingStyles from "@/styles/OnboardingStyles";


export default function Login() {
    const theme = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])
    const OnboardingStyles = useMemo(() => getOnboardingStyles(theme), [theme])
    const router = useRouter()

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [statusShown, setStatusShown] = React.useState(false);
    const [statusText, setStatusText] = React.useState("");

    function showStatus(text: string) {
        setStatusText(text);
        setStatusShown(true);
    }

    async function onLoginButtonPress() {
        if (username !== "" && password !== "") {
            showStatus("Loading")
            try {
                const response = await login(username, password);
                if (response.status !== 401) {
                    const key = await response.text();
                    await AsyncStorage.setItem("api_key", key);
                    showStatus("Logged in")
                    router.navigate("/")
                } else {
                    showStatus("Incorrect username or password");
                }

            } catch (error) {
                if (error instanceof CannotConnectError) {
                    console.error("couldn't log in");
                    showStatus("Server not connected or offline!")
                } else {
                    console.error("an unknown network error occurred when logging in", error);
                }
            }

        } else {
            showStatus("Username and password are required");
        }
    }

    return (
        <SafeAreaView style={OnboardingStyles.view}>
            <Text style={styles.headerText} variant={"displayLarge"}>Login now</Text>
            <Text style={styles.subtext}>
                <Link href={"/CreateUser"}>
                    Don&#39;t have an account?
                    <Text style={styles.linkText}> Sign up now</Text>
                </Link>
            </Text>
            <FullWidthTextInput
                placeholder={"Enter username"}
                onChangeText={setUsername}
                value={username}/>
            <FullWidthTextInput
                placeholder={"Enter password"}
                onChangeText={setPassword}
                value={password}
            />
            <FullWidthButton text={"Login"} onPress={onLoginButtonPress}/>
            {(statusShown &&
                <View style={styles.centeredView}>
                    <Text>{statusText}</Text>
                </View>)}
        </SafeAreaView>
    );
}