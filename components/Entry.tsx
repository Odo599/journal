import {Text, View} from "react-native";
import EntryStyles from "@/styles/EntryStyles";

type EntryProps = {
    body: string,
    created: string
}

export default function Entry({body, created}: EntryProps) {
    return (
        <View style={EntryStyles.view}>
            <Text style={EntryStyles.body}>{body}</Text>
            <Text style={EntryStyles.timestamp}>created at {created}</Text>
        </View>
    );
}