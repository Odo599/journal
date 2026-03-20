import {View, Image as RNImage} from "react-native";
import {Image} from 'expo-image';
import React, {useEffect, useRef, useState} from "react";
import getImageURI from "@/lib/database/getImageURI";
import getServerImage from "@/lib/backend/getServerImage";
import getEntryImageStyles from "@/styles/EntryImageStyles";
import {IconButton, useTheme} from "react-native-paper";

type EntryImageProps = {
    id: string
    setMenuPosition: (arg0: { x: number, y: number }) => void
    setMenuVisible: (arg0: boolean) => void
    setCurrentImage: (arg0: string) => void
}

export default function EntryImage({id, setMenuPosition, setMenuVisible, setCurrentImage}: EntryImageProps) {
    const theme = useTheme()
    const EntryImageStyles = getEntryImageStyles()

    const buttonRef = useRef<View>(null)

    const [uri, setURI] = useState<string>()
    const [aspectRatio, setAspectRatio] = useState<number>()

    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (!id) return

            const response = await getImageURI(id)
            if (cancelled) return

            let finalUri = response

            if (!finalUri) {
                const serverResponse = await getServerImage(id)
                if (!cancelled) finalUri = serverResponse
            }

            if (finalUri && !cancelled) {
                setURI(finalUri)

                RNImage.getSize(finalUri, (w, h) => {
                    if (!cancelled) {
                        setAspectRatio(w / h)
                    }
                })
            }
        })()

        return () => {
            cancelled = true
        }
    }, [id])

    return (
        <>
            {uri &&
                <View style={[EntryImageStyles.container, {aspectRatio}]}>
                    <Image
                        source={{uri: uri}}
                        style={EntryImageStyles.image}
                        contentFit={"cover"}
                    />

                </View>
            }
            <IconButton
                ref={buttonRef}
                icon={"dots-vertical"}
                iconColor={theme.colors.onBackground}
                style={EntryImageStyles.icon}
                onPress={() => {
                    if (buttonRef.current) {
                        buttonRef.current.measure((_x, _y, width, height, pageX, pageY) => {
                            setMenuPosition({x: pageX + width, y: pageY + height + 5})
                            setCurrentImage(id)
                            setMenuVisible(true)
                        })
                    }
                }}
            />
        </>
    );
}