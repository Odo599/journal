import {useTheme} from 'react-native-paper';
import {SafeAreaView} from "react-native-safe-area-context";
import EntriesView from "@/components/EntriesView";
import {CreateEntryButton} from "@/components/CreateEntryButton";


export default function Index() {
    const theme = useTheme();

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
            <EntriesView/>
            <CreateEntryButton/>
        </SafeAreaView>
    );
}
