import {Text, View} from "react-native";
import React from 'react';
import styles from "@/styles/styles";
import createUserStyles from "@/styles/CreateUserStyles";
import createUser from "@/lib/backend/createUser";
import FullWidthButton from "@/components/FullWidthButton";
import FullWidthTextInput from "@/components/FullWidthTextInput";

export default function CreateUser() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [emptyInputErrorShown, setEmptyInputErrorShown] = React.useState(false)

    function onCreateUserButtonPress() {
        if (username !== "" && password !== "") {
            createUser(username, password)
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
                <FullWidthButton text={"Create User"} onPress={onCreateUserButtonPress}/>
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