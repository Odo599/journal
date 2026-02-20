import {Text, View} from "react-native";
import createUserStyles from "@/styles/CreateUserStyles";
import FullWidthTextInput from "@/components/FullWidthTextInput";
import FullWidthButton from "@/components/FullWidthButton";
import styles from "@/styles/styles";
import React from "react";
import login from "@/lib/backend/login";

export default function Login() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errorShown, setErrorShown] = React.useState(false);
    const [errorText, setErrorText] = React.useState("");

    function showError(text: string) {
        setErrorText(text);
        setErrorShown(true);
    }


    async function onLoginButtonPress() {
        setErrorShown(false);
        if (username !== "" && password !== "") {
            const response = await login(username, password);
            console.log('response', response);
            if (response.status === 401) {
                showError("Incorrect username or password")
            }
        } else {
            showError("Username and password are required")
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
                <FullWidthButton text={"Login"} onPress={onLoginButtonPress}/>
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