// noinspection JSUnusedGlobalSymbols

import {Tabs} from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import {useTheme} from "react-native-paper";


export default function TabLayout() {
    const theme = useTheme()

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {backgroundColor: theme.colors.background},
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
                headerShown: false
            }}
        >
            <Tabs.Screen
                name={"index"}
                options={{
                    title: "Home",
                    tabBarIcon: ({color}) =>
                        <Feather name="book-open" size={24} color={color}/>
                }}/>
            <Tabs.Screen
                name={"menu"}
                options={{
                    title: "Menu",
                    tabBarIcon: ({color}) =>
                        <MaterialIcons size={28} name="menu" color={color}/>
                }}
            />
        </Tabs>
    )
}