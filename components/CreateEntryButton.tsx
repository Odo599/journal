import {Pressable} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import CreateEntryButtonStyles from "@/styles/CreateEntryButtonStyles";
import createEntry from "@/lib/backend/createEntry";
import {useRouter} from "expo-router";


export function CreateEntryButton() {
    const router = useRouter()

    function onPress() {
        (async () => {
            try {
                const response = await createEntry();
                const entry_id_str = await response.text();
                const entry_id = Number(entry_id_str);
                if (!isNaN(entry_id)) {
                    router.navigate(`/entry/${entry_id}`)
                } else {
                    console.error("unknown entry id value", entry_id_str)
                }
            } catch (e) {
                console.error("error when creating entry", e)
            }
        })()
    }

    return (
        <Pressable
            style={CreateEntryButtonStyles.container}
            onPress={onPress}
        >
            <MaterialIcons name="add" size={30} color="white"/>
        </Pressable>
    );
}