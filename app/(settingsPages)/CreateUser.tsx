import {Text, View} from "react-native";
import React from 'react';
import styles from "@/styles/styles";
import createUserStyles from "@/styles/CreateUserStyles";
import createUser from "@/lib/backend/createUser";
import FullWidthButton from "@/components/FullWidthButton";
import FullWidthTextInput from "@/components/FullWidthTextInput";
import CannotConnectError from "@/lib/errors/CannotConnectError";

export default function CreateUser() {
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
                await createUser(username, password);
                hideError();
            } catch (error) {
                if (error instanceof CannotConnectError) {
                    console.error("couldn't create user")
                    showError("Server not connected or offline!")
                } else {
                    console.error("an unknown network error occurred when logging in", error)
                }
            }
        } else {
            showError("Username and password are required");
        }
    }

    return (
        <>
            <View style={createUserStyles.createUserView}>
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
            </View>
            {errorShown && (<View
            >
                <View style={styles.centeredView}>
                    <Text>{errorText}</Text>
                </View>
            </View>)}
        </>
    );
}