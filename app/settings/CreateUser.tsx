import {Text, TextInput, View} from "react-native";
import React from 'react';
import styles from "@/app/styles/styles";
import createUserStyles from "@/app/styles/CreateUserStyles";
import createUser from "@/app/remote/createUser";
import FullWidthButton from "@/app/components/FullWidthButton";

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
                <TextInput
                    style={styles.fullWidthTextInput}
                    placeholder={"Enter username"}
                    onChangeText={setUsername}
                    value={username}/>
                <TextInput
                    style={styles.fullWidthTextInput}
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