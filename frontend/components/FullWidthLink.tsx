import {Pressable, View, GestureResponderEvent} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import getFullWidthLinkStyles from "@/styles/FullWidthLinkStyles";
import {useTheme, Text} from "react-native-paper";
import {useMemo} from "react";

type FullWidthLinkProps = {
    onPress: (event: GestureResponderEvent) => void,
    text: string
}

export default function FullWidthLink({onPress, text}: FullWidthLinkProps) {
    const theme = useTheme()
    const FullWidthLinkStyles = useMemo(() => getFullWidthLinkStyles(theme), [theme])
    return (
        <Pressable onPress={onPress}>
            <View style={FullWidthLinkStyles.view}>
                <Text>{text}</Text>
                <MaterialIcons
                    name="arrow-forward"
                    size={24} color={theme.colors.onBackground}
                    style={FullWidthLinkStyles.arrow}/>
            </View>
        </Pressable>
    );
}