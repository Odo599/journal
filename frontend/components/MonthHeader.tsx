import {View} from "react-native";
import {Text, useTheme} from "react-native-paper";
import {useMemo} from "react";
import {parse, format} from "date-fns";
import getMonthHeaderStyles from "@/styles/MonthHeaderStyles";

type MonthHeaderProps = {
    month: string
}

export function MonthHeader({month}: MonthHeaderProps) {
    const theme = useTheme()
    const MonthHeaderStyles = useMemo(() => getMonthHeaderStyles(theme), [theme])

    const formatDate = () => {
        const date = parse(month, "MMMM yyyy", new Date())
        return format(date, "MMMM")
    }

    return (
        <View style={MonthHeaderStyles.container}>
            <Text variant={"headlineLarge"}>{formatDate()}</Text>
        </View>
    );
}