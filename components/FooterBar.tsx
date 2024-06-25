import React, { useState } from 'react'
import { View } from './Themed'
import { useTailwind } from 'tailwind-rn'
import FooterItem from './FooterItem';
import { Dimensions, Pressable } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useScreen } from '@/contexts/ScreenContext';


const FooterBar = () => {
    
    const tw = useTailwind();
    const {
        screen,
        setScreen
    } = useScreen();
    
    return (
        <View style={[tw("flex flex-row justify-between"),{
            minWidth: '100%', 
            marginTop: Dimensions.get('window').height - Dimensions.get('window').height * 0.038, 
            borderColor: '#211f29', 
            borderWidth: 1, 
            // borderRadius: 20, 
            height: 63, 
            zIndex: 11,
            backgroundColor: '#261f24',
            position: 'absolute',

        }]}>
                <FooterItem 
                    title='Home' 
                    icon={<MaterialIcons
                        size={30}
                        color={screen === 'Home' ? 'white' : 'gray'}
                        name='home'
                        style={{
                        alignSelf: 'center', 
                        borderRadius: 14, 
                        borderColor: '#454559',
                        paddingHorizontal: 18, 
                        paddingVertical: screen === 'Favorite' ? 2 : 1, 
                        borderWidth: screen === 'Home' ? 0.5 : 0, 
                        backgroundColor: screen === 'Home' ? '#454559' : '#211f24',
                        
                        }}
                        
                        
                    />}
                />
            <FooterItem
                title='Explore'
                icon={<MaterialIcons
                    size={30}
                    color={screen === 'Explore' ? 'white' : 'gray'}
                    name='explore'
                    style={{
                        alignSelf: 'center',
                        borderRadius: 14,
                        borderColor: '#454559',
                        paddingHorizontal: 18,
                        paddingVertical: screen === 'Favorite' ? 2 : 1, 
                        borderWidth: screen === 'Explore' ? 0.5 : 0,
                        backgroundColor: screen === 'Explore' ? '#454559' : '#211f24',

                    }}
                    
                />}
            />
            <FooterItem
                title='Favorite'
                icon={<MaterialIcons
                    size={30}
                    color={screen === 'Favorite' ? 'white' : 'gray'}
                    name='favorite'
                    style={{
                        alignSelf: 'center',
                        borderRadius: 14,
                        borderColor: '#454559',
                        paddingVertical: screen === 'Favorite' ? 2 : 1, 
                        paddingHorizontal: 18,
                        borderWidth: screen === 'Favorite' ? 0.5 : 0,
                        backgroundColor: screen === 'Favorite' ? '#454559' : '#211f24',

                    }}
                />}
            />
            <FooterItem
                title='Account'
                icon={<MaterialCommunityIcons
                    size={30}
                    color={screen === 'Account' ? 'white' : 'gray'}
                    name='account'
                    style={{
                        alignSelf: 'center',
                        borderRadius: 14,
                        borderColor: '#454559',
                        paddingVertical: screen === 'Account'? 2 : 1, 
                        paddingHorizontal: 18,
                        borderWidth: screen === 'Account' ? 0.5 : 0,
                        backgroundColor: screen === 'Account' ? '#454559' : '#211f24',

                    }}
                    
                />}
            />
        </View>
    )
}

export default FooterBar