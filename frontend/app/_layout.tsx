// noinspection JSUnusedGlobalSymbols

import {Stack} from "expo-router";
import {StatusBar} from "react-native";
import {KeyboardProvider} from "react-native-keyboard-controller";

export default function RootLayout() {
    return (
        <KeyboardProvider>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#FF00000"
                translucent={false}
            />
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="(settingsPages)/CreateUser" options={{title: "Create User"}}/>
                <Stack.Screen name="(settingsPages)/Login" options={{title: "Login"}}/>
                <Stack.Screen name="entry/[id]" options={{headerShown: false}}/>
            </Stack>
        </KeyboardProvider>
    );
}
