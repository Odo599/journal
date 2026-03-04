import {GestureResponderEvent, Modal, Pressable, View, Text, Vibration} from "react-native";
import uuid from 'react-native-uuid';
import ContextMenuStyles from "@/styles/ContextMenuStyles";
import React, {useLayoutEffect, useRef, useState} from "react";

type ContextMenuProps = {
    visible: boolean,
    setContextMenuVisible: (arg0: boolean) => void,
    position: { x: number, y: number },
    items: ContextMenuItem[],
    anchor: {
        horizontal: "left" | "right" | "centre",
        vertical: "top" | "bottom" | "centre"
    }
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

export default function ContextMenu({
                                        visible,
                                        setContextMenuVisible,
                                        position,
                                        items,
                                        anchor,
                                    }: ContextMenuProps) {
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);

    const menuRef = useRef<View>(null)
    const backgroundViewRef = useRef<View>(null)


    useLayoutEffect(() => {
        if (menuRef.current !== null) {
            menuRef.current.measure((_x, _y, menuWidth, menuHeight) => {
                if (backgroundViewRef.current !== null) {
                    backgroundViewRef.current.measure((__x, __y, backgroundWidth, backgroundHeight) => {
                        const padding = 10
                        const setX = (x: number) => setXPos(Math.max(Math.min(backgroundWidth - menuWidth - padding, x), padding))
                        const setY = (y: number) => setYPos(Math.max(Math.min(backgroundHeight - menuHeight - padding, y), padding))

                        if (anchor.vertical === "top") setY(position.y)
                        else if (anchor.vertical === "bottom") setY(position.y - menuHeight)
                        else setY(position.y - menuHeight / 2)

                        if (anchor.horizontal === "left") setX(position.x)
                        else if (anchor.horizontal === "right") setX(position.x - menuWidth)
                        else setX(position.x - menuWidth / 2)
                    })
                }


            })
        }

    }, [position, anchor]);
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType={"fade"}
        >
            <View ref={backgroundViewRef} style={{flex: 1}}>
                <Pressable
                    style={ContextMenuStyles.overlay}
                    onPressIn={() => {
                        setContextMenuVisible(false)
                    }}
                >
                    <View
                        style={[ContextMenuStyles.menu,
                            {left: xPos},
                            {top: yPos}
                        ]}
                        ref={menuRef}
                    >
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
            </View>
        </Modal>
    );
}