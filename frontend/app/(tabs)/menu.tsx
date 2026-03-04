import FullWidthLink from "@/components/FullWidthLink";
import {useRouter} from 'expo-router';
import {ScrollView} from "react-native";

export default function Menu() {
    const router = useRouter();

    return (
        <ScrollView>
            <FullWidthLink
                onPress={() => {
                    router.navigate("/CreateUser")
                }}
                text={"Create Account"}
            />
            <FullWidthLink
                onPress={() => {
                    router.navigate("/Login")
                }}
                text={"Login"}
            />
        </ScrollView>
    )
}