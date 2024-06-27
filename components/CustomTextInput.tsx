import { TextInputType } from '@/types/TextInputType';
import { DarkTheme } from '@react-navigation/native';
import { Eye } from 'lucide-react-native';
import React, { useState } from 'react'
import { Button, Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MD3Colors, TextInput } from 'react-native-paper';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { useTailwind } from 'tailwind-rn';



const CustomTextInput = ({
    label,
    content,
    setContent,
    hidden, 
    error, 
    onChange, 
    onEndEditing, 
    readonly
}: TextInputType) => {
    const tw = useTailwind();
    const [secure, setSecure] = useState(hidden)
    return (
        <Animated.View style={tw("pt-2 px-4")} entering={SlideInLeft} exiting={SlideInRight}>
            <TextInput
                label={label}
                value={content}
                onChangeText={(text) => setContent(text)}
                mode='outlined'
                theme={DarkTheme}
                textColor='white'
                outlineStyle={{
                    borderRadius: 8,
                    // borderColor: error === false ? 'green' : 'gray'
                }}
                contentStyle={{
                    fontFamily: 'monospace', 
                }}
                secureTextEntry={secure}
                error={error !== null ? error : false}
                // outlineColor={error === true ? 'green' : 'gray'}
                outlineColor= {readonly ? 'green' : 'gray'}
                onChange={() => { 
                    onChange && onChange()
                    
                }}
                right={hidden
                    ? (
                        
                        
                        <TextInput.Icon icon={secure ? "eye" : "eye-off"} onPress={() => { 
                            setSecure(!secure)
                        }} />
                        
                    )
                    :
                    <></>
                }
                onEndEditing={onEndEditing}
                readOnly={readonly}
            />
        </Animated.View>
  )
}

export { CustomTextInput };