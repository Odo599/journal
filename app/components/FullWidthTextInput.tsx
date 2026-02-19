import styles from "@/app/styles/styles";
import {TextInput} from "react-native";
import React from "react";

type FullWidthTextInputProps = {
    placeholder: string;
    onChangeText: (text: string) => void;
    value: any
};


export default function FullWidthTextInput({onChangeText, value, placeholder}: FullWidthTextInputProps) {
    return (
        <TextInput
            style={styles.fullWidthTextInput}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}/>
    );
}