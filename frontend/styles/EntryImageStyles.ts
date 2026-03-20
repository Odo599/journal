import {StyleSheet} from "react-native";

const getEntryImageStyles = () => {
    return StyleSheet.create({
        image: {
            width: "100%",
            height: "100%",
            borderRadius: 12
        },
        container: {
            padding: 17,
            paddingBottom: 0
        },
        icon: {
            position: "absolute",
            right: 15,
            top: 15
        }
    })
}

export default getEntryImageStyles