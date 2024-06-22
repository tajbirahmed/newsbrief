import React from 'react'; 
import { Text, View } from './Themed'; 
import { useTailwind } from 'tailwind-rn'; 
import Constants from 'expo-constants'; 
import IconWithFeedback from './IconWithFeedback';
import { AlignLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

export interface HeaderProps { 
    open?: boolean; 
    setOpen: (open : boolean) => void
}

const HeaderBar = ({ 
    open, 
    setOpen
} : HeaderProps) => {

    const tw = useTailwind(); 

    return (
        <View style={[tw("px-4 mx-4 flex flex-row mt-1"), {
            marginTop: Constants.statusBarHeight, 
            backgroundColor: '#282424', 
            minHeight: '6%',
            maxHeight: '6%', 
            borderRadius: 20, 
            alignItems: 'center', 
            columnGap: 10, 
            zIndex: 12,
            
        }]}>
            <View style={[tw("h-full"), {
                backgroundColor: '#282424',
            }]}>
                <Pressable
                    onPress={() => {
                        setOpen(!open)
                    }}
                >
                    <IconWithFeedback 
                        Icon={<AlignLeft size={28} color={"gray"}/>}
                    />
                </Pressable>
                
        </View>
        <Text style={[tw("font-semibold text-lg"), {color: 'gray'}]}>
                Search in News
        </Text>
    </View>
          
  )
}

export default HeaderBar