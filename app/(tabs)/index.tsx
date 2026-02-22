import {ScrollView} from "react-native";
import TopHeader from "@/components/TopHeader";
import EntriesView from "@/components/EntriesView";
import {SafeAreaView} from "react-native-safe-area-context";
import {CreateEntryButton} from "@/components/CreateEntryButton";


export default function Index() {
    // @ts-ignore
    return (
        <SafeAreaView>
            <ScrollView>
                <TopHeader/>
                <EntriesView/>
            </ScrollView>
            <CreateEntryButton/>
        </SafeAreaView>
    );
}
