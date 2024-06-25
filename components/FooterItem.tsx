import React from 'react'
import { Text, View } from './Themed'
import { useTailwind } from 'tailwind-rn'
import { Pressable } from 'react-native';
import { useScreen } from '@/contexts/ScreenContext';


interface FooterProps {
  title: string,
  icon: React.ReactNode,
}

const FooterItem = ({
  title,
  icon, 
}: FooterProps) => {
  const tw = useTailwind();
  
  const {
    screen,
    setScreen
  } = useScreen(); 

  return (
    <Pressable style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#211f24',
      // borderWidth: 0.5,
      // borderColor: 'white'
    }}
      onPress={() => {
        setScreen(title)
      }}
    >
      <View style={[tw("flex flex-col"), {
        columnGap: 1,
        backgroundColor: 'none',

      }]}>

        {icon}
        <Text
          style={[tw(""), {
            fontSize: 12,
            alignSelf: 'center',
            backgroundColor: 'none', 
            color: title === screen ? 'white' : 'gray',
            fontWeight: title === screen ? '900' : '400',
          }]}
        >{title}
        </Text>
      </View>
    </Pressable>
  )
}

export default FooterItem