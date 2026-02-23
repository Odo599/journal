import EntriesView from "@/components/EntriesView";
import {SafeAreaView} from "react-native-safe-area-context";
import {CreateEntryButton} from "@/components/CreateEntryButton";


export default function Index() {
    return (
        <SafeAreaView>
            <EntriesView/>
            <CreateEntryButton/>
        </SafeAreaView>
    );
}
