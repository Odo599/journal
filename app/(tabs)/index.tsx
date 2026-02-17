import {ScrollView, View} from "react-native";
import TopHeader from "@/app/components/TopHeader";
import EntriesView from "@/app/components/EntriesView";


export default function Index() {
    // @ts-ignore
    return (
        <>
            <View
                style={{
                    flex: 1
                }}
            >
                <ScrollView>
                    <TopHeader/>
                    <EntriesView/>
                </ScrollView>
            </View>
        </>
    );
}
