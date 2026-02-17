import {ScrollView, Text, View} from "react-native";
import TopHeader from "@/app/components/TopHeader";


export default function Index() {
    // @ts-ignore
    return (
        <View
            style={{
                flex: 1,
                padding: 20
            }}
        >
            <ScrollView>
                <TopHeader/>
                <Text>More</Text>
            </ScrollView>
        </View>
    );
}
