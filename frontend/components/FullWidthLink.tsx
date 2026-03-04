import {Pressable, View, Text, GestureResponderEvent} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FullWidthLinkStyles from "@/styles/FullWidthLinkStyles";

type FullWidthLinkProps = {
    onPress: (event: GestureResponderEvent) => void,
    text: string
}

export default function FullWidthLink({onPress, text}: FullWidthLinkProps) {
    return (
        <Pressable onPress={onPress}>
            <View style={FullWidthLinkStyles.view}>
                <Text>{text}</Text>
                <MaterialIcons
                    name="arrow-forward"
                    size={24} color="black"
                    style={FullWidthLinkStyles.arrow}/>
            </View>
        </Pressable>
    );
}