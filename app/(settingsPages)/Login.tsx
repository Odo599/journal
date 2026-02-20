import {Text, View} from "react-native";
import createUserStyles from "@/styles/CreateUserStyles";
import FullWidthTextInput from "@/components/FullWidthTextInput";
import FullWidthButton from "@/components/FullWidthButton";
import styles from "@/styles/styles";
import React from "react";
import login from "@/lib/login";

export default function Login() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [emptyInputErrorShown, setEmptyInputErrorShown] = React.useState(false)

    async function onLoginButtonPress() {
        if (username !== "" && password !== "") {
            await login(username, password)
            setEmptyInputErrorShown(false)
        } else {
            setEmptyInputErrorShown(true)
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
            {emptyInputErrorShown && (<View
            >
                <View style={styles.centeredView}>
                    <Text>Username and password are required</Text>
                </View>
            </View>)}
        </>
    );
}