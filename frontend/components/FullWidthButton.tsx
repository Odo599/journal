import {Text} from "react-native";
import React, {useMemo} from "react";
import {useTheme, Button} from "react-native-paper";
import getStyles from "@/styles/styles";

type FullWidthButtonProps = {
    text: string;
    onPress: () => void;
};


export default function FullWidthButton({text, onPress}: FullWidthButtonProps) {
    const theme = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])

    return (
        <Button
            onPress={onPress}
            mode={"contained"}
            style={styles.fullWidthButton}
        >
            <Text>{text}</Text>
        </Button>
    );
}