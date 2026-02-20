import FullWidthLink from "@/components/FullWidthLink";
import { useRouter } from 'expo-router';

export default function Menu() {
    const router = useRouter();

    return (
        <FullWidthLink
            onPress={() => {router.navigate("/CreateUser")}}
            text={"Create Account"}
        />
    )
}