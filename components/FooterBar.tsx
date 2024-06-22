import React, { useState } from 'react'
import { View } from './Themed'
import { useTailwind } from 'tailwind-rn'
import FooterItem from './FooterItem';
import { Dimensions, Pressable } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


const FooterBar = () => {
    const tw = useTailwind();
    const [selected, setSelected] = useState('Home')
    return (
        <View style={[tw("flex flex-row justify-between"),{
            minWidth: '100%', 
            marginTop: Dimensions.get('window').height - Dimensions.get('window').height * 0.0495, 
            borderColor: '#211f29', 
            borderWidth: 1, 
            // borderRadius: 20, 
            minHeight: '7%', 
            zIndex: 11,
            backgroundColor: '#211f24'

        }]}>
                <FooterItem 
                    title='Home' 
                    icon={<MaterialIcons
                        size={30}
                        color={selected === 'Home' ? 'white' : 'gray'}
                        name='home'
                        style={{
                        alignSelf: 'center', 
                        borderRadius: 12, 
                        borderColor: '#454559',
                        paddingHorizontal: 14, 
                        paddingVertical: selected === 'Favorite' ? 2 : 1, 
                        borderWidth: selected === 'Home' ? 0.5 : 0, 
                        backgroundColor: selected === 'Home' ? '#454559' : '#211f24',
                        
                        }}
                        
                        
                    />}
                    selected={selected}
                    setSelected={setSelected}
                />
            <FooterItem
                title='Explore'
                icon={<MaterialIcons
                    size={30}
                    color={selected === 'Explore' ? 'white' : 'gray'}
                    name='explore'
                    style={{
                        alignSelf: 'center',
                        borderRadius: 12,
                        borderColor: '#454559',
                        paddingHorizontal: 14,
                        paddingVertical: selected === 'Favorite' ? 2 : 1, 
                        borderWidth: selected === 'Explore' ? 0.5 : 0,
                        backgroundColor: selected === 'Explore' ? '#454559' : '#211f24',

                    }}
                    
                />}
                selected={selected}
                setSelected={setSelected}
            />
            <FooterItem
                title='Favorite'
                icon={<MaterialIcons
                    size={30}
                    color={selected === 'Favorite' ? 'white' : 'gray'}
                    name='favorite'
                    style={{
                        alignSelf: 'center',
                        borderRadius: 12,
                        borderColor: '#454559',
                        paddingVertical: selected === 'Favorite' ? 2 : 1, 
                        paddingHorizontal: 14,
                        borderWidth: selected === 'Favorite' ? 0.5 : 0,
                        backgroundColor: selected === 'Favorite' ? '#454559' : '#211f24',

                    }}
                />}
                selected={selected}
                setSelected={setSelected}
            />
            <FooterItem
                title='Account'
                icon={<MaterialCommunityIcons
                    size={30}
                    color={selected === 'Account' ? 'white' : 'gray'}
                    name='account'
                    style={{
                        alignSelf: 'center',
                        borderRadius: 12,
                        borderColor: '#454559',
                        paddingVertical: selected === 'Account'? 2 : 1, 
                        paddingHorizontal: 14,
                        borderWidth: selected === 'Account' ? 0.5 : 0,
                        backgroundColor: selected === 'Account' ? '#454559' : '#211f24',

                    }}
                    
                />}
                selected={selected}
                setSelected={setSelected}
            />
        </View>
    )
}

export default FooterBar