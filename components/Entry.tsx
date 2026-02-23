import {Pressable, Text, View} from "react-native";
import {useRouter} from "expo-router";
import React, {memo} from 'react';


import EntryStyles from "@/styles/EntryStyles";
import Html from "@/components/Html";

type EntryProps = {
    body: string,
    created: string,
    id: number
}

function Entry({body, created, id}: EntryProps) {
    const router = useRouter()

    return (
        <Pressable onPress={() => {
            router.navigate(`/entry/${id}`)
        }}>
            <View style={EntryStyles.view}>
                <Html html={body}/>
                <Text style={EntryStyles.timestamp}>created at {created}</Text>
            </View>
        </Pressable>
    );
}

export default memo(Entry);