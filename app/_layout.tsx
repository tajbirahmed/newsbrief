import { AuthProvider } from '@/contexts/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native';

import { TailwindProvider } from 'tailwind-rn';
import utilities from '../tailwind.json';

export const unstable_settings = {
    initialRouteName: '/',
};

const RootLayout = () => {
    const bgval = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    return (
        <TailwindProvider utilities={utilities} colorScheme={"dark"} >
            {/* <ThemeProvider value={bgval}> */}

                <AuthProvider>
                    <Slot />
                </AuthProvider>

            {/* </ThemeProvider> */ }
        </TailwindProvider>
    )
}

export default RootLayout