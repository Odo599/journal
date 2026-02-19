import {ScrollView, View} from "react-native";
import TopHeader from "@/components/TopHeader";
import EntriesView from "@/components/EntriesView";
import {SafeAreaView} from "react-native-safe-area-context";


export default function Index() {
    // @ts-ignore
    return (
        <>
            <SafeAreaView>
                <View style={{}}>
                    <ScrollView>
                        <TopHeader/>
                        <EntriesView/>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}
