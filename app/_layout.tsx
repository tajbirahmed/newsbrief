import 'react-native-gesture-handler';
import { AuthProvider } from '@/contexts/AuthContext';
import { Slot } from 'expo-router'
import React from 'react'
import { TailwindProvider } from 'tailwind-rn';
import utilities from '../tailwind.json';
import { EmailProvider } from '@/contexts/EmailContext';
import { ProfileImageUrlProvider } from '@/contexts/ProfileImageUrlContext';
import { UserNameProvider } from '@/contexts/UserNameContext';


export const unstable_settings = {
    initialRouteName: '/home/app/explore/',
};

const RootLayout = () => {
    return (
        <TailwindProvider utilities={utilities} colorScheme={"dark"} >
            {/* <ThemeProvider value={bgval}> */}
            <EmailProvider>
                <AuthProvider>
                    
                    <ProfileImageUrlProvider>
                        <UserNameProvider>
                            <Slot />
                        </UserNameProvider>
                    </ProfileImageUrlProvider>
                    
                </AuthProvider>
            </EmailProvider>
            {/* </ThemeProvider> */ }
        </TailwindProvider>
    )
}

export default RootLayout