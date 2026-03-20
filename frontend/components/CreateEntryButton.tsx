import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import getCreateEntryButtonStyles from "@/styles/CreateEntryButtonStyles";
import {useRouter} from "expo-router";
import createEntry from "@/lib/database/createEntry";
import {useTheme, IconButton} from "react-native-paper";


export function CreateEntryButton() {
    const router = useRouter()
    const theme = useTheme()
    const CreateEntryButtonStyles = getCreateEntryButtonStyles()

    function onPress() {
        (async () => {
            try {
                const entry = await createEntry()
                if (entry.offline) {
                    router.navigate(`/entry/${entry.id}?offlineEntry=true`)
                } else {
                    router.navigate(`/entry/${entry.id}`)
                }
            } catch (e) {
                console.error("error when creating entry", e)
            }
        })()
    }

    return (
        <IconButton
            style={CreateEntryButtonStyles.container}
            onPress={onPress}
            icon={() => {
                return <MaterialIcons name="add" size={30}/>
            }}
            size={70}
            containerColor={theme.colors.primary}
            rippleColor={`${theme.colors.onPrimary}1F`}
        />
    );
}