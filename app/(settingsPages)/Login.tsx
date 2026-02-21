import {Text, View} from "react-native";
import {createAsyncStorage} from "@react-native-async-storage/async-storage";
import React from "react";
import createUserStyles from "@/styles/CreateUserStyles";
import FullWidthTextInput from "@/components/FullWidthTextInput";
import FullWidthButton from "@/components/FullWidthButton";
import styles from "@/styles/styles";
import login from "@/lib/backend/login";
import CannotConnectError from "@/lib/errors/CannotConnectError";


export default function Login() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [statusShown, setStatusShown] = React.useState(false);
    const [statusText, setStatusText] = React.useState("");

    const storage = createAsyncStorage("appDB");

    function showStatus(text: string) {
        setStatusText(text);
        setStatusShown(true);
    }

    function hideStatus() {
        setStatusShown(false);
        setStatusText("");
    }


    async function onLoginButtonPress() {
        if (username !== "" && password !== "") {
            hideStatus();
            try {
                const response = await login(username, password);
                if (response.status !== 401) {
                    const key = await response.text();
                    await storage.setItem("api_key", key);
                    showStatus("Logged in")
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
            {statusShown && (<View
            >
                <View style={styles.centeredView}>
                    <Text>{statusText}</Text>
                </View>
            </View>)}
        </>
    );
}