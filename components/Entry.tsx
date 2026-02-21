import {Pressable, Text, View} from "react-native";
import EntryStyles from "@/styles/EntryStyles";
import {useRouter} from "expo-router";

type EntryProps = {
    body: string,
    created: string,
    id: number
}

export default function Entry({body, created, id}: EntryProps) {
    const router = useRouter()
    return (
        <Pressable onPress={() => {
            router.navigate(`/entry/${id}`)
        }}>
            <View style={EntryStyles.view}>
                <Text style={EntryStyles.body}>{body}</Text>
                <Text style={EntryStyles.timestamp}>created at {created}</Text>
            </View>
        </Pressable>
    );
}