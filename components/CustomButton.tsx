import { ButtonPropsType } from '@/types/ButtonPropsType'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import { useTailwind } from 'tailwind-rn'
//animations 

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';


const CustomButton = ({
    buttonLabel,
    link,
    handleClick,
    disabled
}: ButtonPropsType) => {

    const [loading, setLoading] = useState<boolean>(false)
    const handleButtonPress = () => {
        setLoading(true);
        handleClick && handleClick();
        setLoading(false);
    }
    const tw = useTailwind();

    //amimation 
    const pressed = useSharedValue<boolean>(false);

    const tap = Gesture.Tap()
        .onBegin(() => {
            pressed.value = true;
        })
        .onFinalize(() => {
            pressed.value = false;
        })

    const animatedStyle = useAnimatedStyle(() => ({
        backgroundColor: pressed.value ? '#FFE04B' : '#B53DDF',
        transform: [
            {
                scale: withTiming(pressed.value ? 1.1 : 1)
            }
        ],
    }))
    //  text-xl
    return (
        <GestureHandlerRootView style={tw("m-4 w-48 self-center")}>
            <GestureDetector gesture={tap}>
               <Animated.View style={[tw("rounded-3xl"),animatedStyle]}>
                    <Button
                        mode='contained'
                        labelStyle={[tw("text-white"), { fontSize: 16 }]}
                        onPress={() => { handleButtonPress() }}
                        theme={{
                            colors: {
                                primary: '#B53DDF'
                            } 
                            
                        }}
                        style={
                            [tw("h-10 font-semibold rounded-lg") ]
                        }
                        
                        loading={loading}
                        disabled={disabled!}
                    >
                        {buttonLabel}
                    </Button>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    )
}

export default CustomButton