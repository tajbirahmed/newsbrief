import { AuthProvider } from '@/contexts/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native';

export const unstable_settings = {
    initialRouteName: '/',
};

const RootLayout = () => {
    const bgval = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;    
    return (
        <ThemeProvider value={bgval}>
            <AuthProvider>
                <Slot />      
            </AuthProvider>
        </ThemeProvider>
    )
}

export default RootLayout