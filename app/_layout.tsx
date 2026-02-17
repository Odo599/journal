// noinspection JSUnusedGlobalSymbols

import {Stack} from "expo-router";
import styles from "@/app/styles"
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "react-native";

export default function RootLayout() {
    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={styles.topHeader.backgroundColor}
                translucent={false}
            />
            <SafeAreaView style={{flex: 1, backgroundColor: styles.topHeader.backgroundColor}}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                </Stack>
            </SafeAreaView>
        </>

    );
}
