import {TextInput} from "react-native";
import React, {useMemo} from "react";
import {useTheme} from "react-native-paper";
import getStyles from "@/styles/styles";

type FullWidthTextInputProps = {
    placeholder: string;
    onChangeText: (text: string) => void;
    value: any
};


export default function FullWidthTextInput({onChangeText, value, placeholder}: FullWidthTextInputProps) {
    const theme = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])

    return (
        <TextInput
            style={styles.fullWidthTextInput}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            placeholderTextColor={theme.colors.onSurfaceVariant}
        />
    );
}