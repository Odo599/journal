import {Pressable} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import CreateEntryButtonStyles from "@/styles/CreateEntryButtonStyles";
import {useRouter} from "expo-router";
import createEntry from "@/lib/database/createEntry";


export function CreateEntryButton() {
    const router = useRouter()

    function onPress() {
        (async () => {
            try {
                const entry = await createEntry()
                console.log(entry)
                if (!isNaN(entry.id)) {
                    if (entry.offline) {
                        router.navigate(`/entry/${entry.id}?offlineEntry=true`)
                    } else {
                        router.navigate(`/entry/${entry.id}`)
                    }
                } else {
                    console.error("unknown entry id value", entry.id)
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