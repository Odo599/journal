import {GestureResponderEvent, Pressable, StyleProp, Text} from "react-native";
import styles from "@/styles/styles";
import React from "react";

type ButtonNoBackgroundProps = {
    onPress: (event: GestureResponderEvent) => void,
    text: string,
    style?: StyleProp<any>
}

export default function ButtonNoBackground({onPress, text, style = {}}: ButtonNoBackgroundProps) {
    return (
        <Pressable
            style={[styles.noBackgroundButton, style]}
            onPress={onPress}
        >
            <Text>{text}</Text>
        </Pressable>
    );
}