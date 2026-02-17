import {View, Text} from "react-native";
import styles from "@/app/styles"
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFonts, SourceSansPro_700Bold} from '@expo-google-fonts/source-sans-pro';

export default function TopHeader() {
    let [fontsLoaded] = useFonts({
        SourceSansPro_700Bold,
    });
    if (!fontsLoaded) {
        return <Text>Loading...</Text>
    }
    return <View style={styles.topHeader}>
        <Icon name="menu" size={40}/>
        <Text style={styles.topHeaderTitle}>Journal</Text>
    </View>
}