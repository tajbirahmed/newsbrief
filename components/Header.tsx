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
    meesage?: string;
}

const HeaderBar = ({ 
    open, 
    setOpen, 
    meesage
} : HeaderProps) => {

    const tw = useTailwind(); 

    return (
        <View style={[tw("px-4 mx-4 flex flex-row mt-1"), {
            marginTop: Constants.statusBarHeight + 2, 
            backgroundColor: '#282424', 
            height: 55, 
            borderRadius: 20, 
            alignItems: 'center', 
            columnGap: 10, 
            zIndex: 12,
            borderWidth: 1, 
            borderColor: '#282424',
            
        }]}>
            <View style={[tw("h-full"), {
                backgroundColor: 'transparent',
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
                {meesage!}
        </Text>
    </View>
          
  )
}

export default HeaderBar