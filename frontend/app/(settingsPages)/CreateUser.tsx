// noinspection JSUnusedGlobalSymbols

import {View} from "react-native";
import React, {useMemo} from 'react';
import createUser from "@/lib/backend/createUser";
import FullWidthButton from "@/components/FullWidthButton";
import FullWidthTextInput from "@/components/FullWidthTextInput";
import CannotConnectError from "@/lib/errors/CannotConnectError";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link, useRouter} from "expo-router";
import UserAlreadyCreatedError from "@/lib/errors/UserAlreadyCreatedError";
import {useTheme, Text} from "react-native-paper";
import getStyles from "@/styles/styles";
import getOnboardingStyles from "@/styles/OnboardingStyles";

export default function CreateUser() {
    const theme = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])
    const OnboardingStyles = useMemo(() => getOnboardingStyles(theme), [theme])
    const router = useRouter()

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errorShown, setErrorShown] = React.useState(false);
    const [errorText, setErrorText] = React.useState("")

    function showError(text: string) {
        setErrorText(text);
        setErrorShown(true);
    }

    function hideError() {
        setErrorShown(false);
        setErrorText("");
    }

    async function onCreateUserButtonPress() {
        if (username !== "" && password !== "") {
            try {
                showError("Loading...")
                await createUser(username, password);
                hideError();
                showError("Successfully created user.")
                router.navigate("/")
            } catch (error) {
                if (error instanceof CannotConnectError) {
                    console.error("couldn't create user")
                    showError("Server not connected or offline!")
                } else if (error instanceof UserAlreadyCreatedError) {
                    showError("Username already taken. Choose another?")
                } else {
                    console.error("an unknown network error occurred when logging in", error)
                    showError("Something bad happened. Try again?")
                }
            }
        } else {
            showError("Username and password are required");
        }
    }

    return (
        <SafeAreaView style={OnboardingStyles.view}>
            <Text style={styles.headerText} variant={"displayLarge"}>Start writing</Text>
            <Text style={styles.subtext}>
                <Link href={"/Login"}>
                    Already have an account?
                    <Text style={styles.linkText}> Log in here</Text>
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
            <FullWidthButton text={"Create User"} onPress={onCreateUserButtonPress}/>
            {errorShown && (<View
            >
                <View style={styles.centeredView}>
                    <Text>{errorText}</Text>
                </View>
            </View>)}
        </SafeAreaView>
    );
}