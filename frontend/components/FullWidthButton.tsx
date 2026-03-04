import styles from "@/styles/styles";
import {Pressable, Text} from "react-native";
import React from "react";

type FullWidthButtonProps = {
    text: string;
    onPress: () => void;
};


export default function FullWidthButton({text, onPress}: FullWidthButtonProps) {
    return (
        <Pressable
            style={styles.fullWidthButton}
            onPress={onPress}
        >
            <Text>{text}</Text>
        </Pressable>
    );
}