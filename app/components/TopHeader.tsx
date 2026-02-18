import {View, Text} from "react-native";
import TopHeaderStyles from "@/app/styles/TopHeaderStyles"
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFonts, SourceSansPro_700Bold} from '@expo-google-fonts/source-sans-pro';

export default function TopHeader() {
    let [fontsLoaded] = useFonts({
        SourceSansPro_700Bold,
    });
    if (!fontsLoaded) {
        return <Text>Loading...</Text>
    }
    return <View style={TopHeaderStyles.topHeader}>
        <Icon name="menu"/>
        <Text style={TopHeaderStyles.topHeaderTitle}>Journal</Text>
    </View>
}