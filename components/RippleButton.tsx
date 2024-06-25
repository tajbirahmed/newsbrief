import React from 'react';
import { View, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface RippleButtonProps {
    onPress?: () => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const RippleButton: React.FC<RippleButtonProps> = ({ onPress, children, style }) => {
    const rippleOpacity = useSharedValue(0);
    const rippleScale = useSharedValue(0);

    const handlePressIn = () => {
        rippleOpacity.value = 1;
        rippleScale.value = withTiming(1, {
            duration: 300,
            easing: Easing.out(Easing.ease),
        });
    };

    const handlePressOut = () => {
        rippleOpacity.value = withTiming(0, {
            duration: 5000,
            easing: Easing.out(Easing.ease),
        });
        rippleScale.value = 0;
        if (onPress) {
            onPress();
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: rippleOpacity.value,
        transform: [{ scale: rippleScale.value }],
    }));

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.button, style]}
        >
            {children}
            <Animated.View style={[styles.ripple, animatedStyle]} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    ripple: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'gray',
        borderRadius: 100, // Make sure the ripple is always round
        width: 200, // Make sure the ripple is big enough to cover the button
        height: 200,
    },
});

export default RippleButton;
