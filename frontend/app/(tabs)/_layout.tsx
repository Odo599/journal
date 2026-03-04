// noinspection JSUnusedGlobalSymbols

import {Tabs} from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';


export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name={"index"}
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({color}) =>
                        <Feather name="book-open" size={24} color={color} />
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