
import { ReactNode } from 'react';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { View } from './Themed';
import { StyleSheet } from 'react-native';


interface IconWithFeedbackProps {
    Icon: ReactNode;
}


const IconWithFeedback: React.FC<IconWithFeedbackProps> = ({ Icon }) => {
    
    const pressed = useSharedValue<boolean>(false);
    const circleScale = useSharedValue(1);

    const tap = Gesture.Tap()
        .onBegin(() => {
            pressed.value = true;
        })
        .onFinalize(() => {
            pressed.value = false;
        });
    
    const animatedStyles = useAnimatedStyle(() => ({
        // backgroundColor: pressed.value ? '#D3D3D3' : 'none',
        transform: [{
            // scale: withTiming(pressed.value ? 1.6 : 1), 
            rotateY: withTiming(pressed.value ? '180deg' : '0deg'), 
            // rotateX: withTiming(pressed.value ? '90deg' : '0deg')
        }],
    }));
    
    

    return (
        <GestureHandlerRootView style={{
            height: '100%',
            alignItems: 'center', 
            justifyContent: 'center',
        }}>
            <GestureDetector gesture={tap}>
                {/* <Animated.View style={[styles.circle, circleAnimatedStyle]}> */}
                        <Animated.View style={[{ backgroundColor: 'none' }, animatedStyles]}>
                            {Icon}
                        </Animated.View>
                    {/* </Animated.View> */}
            </GestureDetector>
        </GestureHandlerRootView>
    );
}


export default IconWithFeedback;