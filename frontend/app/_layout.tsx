// noinspection JSUnusedGlobalSymbols

import {Stack} from "expo-router";
import {StatusBar, useColorScheme} from "react-native";
import {KeyboardProvider} from "react-native-keyboard-controller";
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from "react-native-paper";
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';


export default function RootLayout() {
    const colorScheme = useColorScheme();
    const {theme} = useMaterial3Theme();

    const currentTheme = colorScheme === 'dark'
        ? {...MD3DarkTheme, colors: theme.dark}
        : {...MD3LightTheme, colors: theme.light}
    return (
        <PaperProvider theme={currentTheme}>
            <KeyboardProvider>
                <StatusBar
                    barStyle={currentTheme.dark ? "light-content" : "dark-content"}
                    translucent={false}
                />
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="(settingsPages)/CreateUser" options={{
                        title: "Create User",
                        headerShown: false
                    }}/>
                    <Stack.Screen name="(settingsPages)/Login" options={{
                        title: "Login",
                        headerShown: false
                    }}/>
                    <Stack.Screen name="(settingsPages)/Welcome" options={{
                        title: "Welcome",
                        headerShown: false
                    }}/>
                    <Stack.Screen name="entry/[id]" options={{headerShown: false}}/>
                </Stack>
            </KeyboardProvider>
        </PaperProvider>
    );
}
