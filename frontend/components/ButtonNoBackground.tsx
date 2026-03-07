import {GestureResponderEvent, Pressable, StyleProp} from "react-native";
import getStyles from "@/styles/styles";
import React, {useMemo} from "react";
import {Text, useTheme} from "react-native-paper";

type ButtonNoBackgroundProps = {
    onPress: (event: GestureResponderEvent) => void,
    text: string,
    style?: StyleProp<any>
}

export default function ButtonNoBackground({onPress, text, style = {}}: ButtonNoBackgroundProps) {
    const theme = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])
    
    return (
        <Pressable
            style={[styles.noBackgroundButton, style]}
            onPress={onPress}
        >
            <Text>{text}</Text>
        </Pressable>
    );
}