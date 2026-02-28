import {GestureResponderEvent, Modal, Pressable, View, Text, Vibration} from "react-native";
import uuid from 'react-native-uuid';
import ContextMenuStyles from "@/styles/ContextMenuStyles";
import React from "react";

type ContextMenuProps = {
    visible: boolean,
    setContextMenuVisible: (arg0: boolean) => void,
    position: { x: number, y: number },
    items: ContextMenuItem[]
}

type ContextMenuItem = {
    onPress?: ((event: GestureResponderEvent) => void),
    closeOnPress?: boolean,
    text: string,
    destructive?: boolean
}

type ContextMenuItemProps = {
    onPress: ((event: GestureResponderEvent) => void),
    closeOnPress: boolean,
    setContextMenuVisible: (arg1: boolean) => void,
    text: string,
    last: boolean,
    destructive: boolean
}

function ContextMenuItemComponent({
                                      onPress,
                                      text,
                                      last,
                                      closeOnPress,
                                      setContextMenuVisible,
                                      destructive
                                  }: ContextMenuItemProps) {
    return (
        <Pressable
            onPress={(e) => {
                if (onPress) onPress(e)
                if (closeOnPress) {
                    Vibration.vibrate(1)
                    setContextMenuVisible(false)
                }
            }}
            style={[ContextMenuStyles.item,
                last ?
                    ContextMenuStyles.itemLast :
                    ContextMenuStyles.itemNotLast]}
        >
            <Text
                style={[
                    ContextMenuStyles.itemText,
                    destructive ? ContextMenuStyles.itemTextDestructive : {}
                ]}
            >
                {text}
            </Text>
        </Pressable>
    )
}

export default function ContextMenu({visible, setContextMenuVisible, position, items}: ContextMenuProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType={"fade"}
        >
            <Pressable
                style={ContextMenuStyles.overlay}
                onPressIn={() => {
                    setContextMenuVisible(false)
                }}
            >
                <View style={[ContextMenuStyles.menu, {top: position.y, left: position.x}]}>
                    {items.map((item, index) => {
                            return (<ContextMenuItemComponent
                                text={item.text}
                                onPress={item.onPress ?? (() => {
                                })}
                                last={index === items.length - 1}
                                closeOnPress={item.closeOnPress ?? false}
                                setContextMenuVisible={setContextMenuVisible}
                                key={uuid.v4()}
                                destructive={item.destructive ?? false}
                            />)
                        }
                    )}
                </View>
            </Pressable>
        </Modal>
    );
}