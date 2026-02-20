import {Tabs} from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name={"index"}
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({color}) =>
                        <MaterialIcons size={28} name="house" color={color}/>,
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