import React from 'react'
import { Text, View } from './Themed'
import { useTailwind } from 'tailwind-rn'
import { Pressable } from 'react-native';


interface FooterProps {
  title: string,
  icon: React.ReactNode,
  selected: string, 
  setSelected: (selected : string) => void
}

const FooterItem = ({
  title,
  icon, 
  selected, 
  setSelected
}: FooterProps) => {
  const tw = useTailwind();
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
        setSelected(title)
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
            color: title === selected ? 'white' : 'gray',
            fontWeight: title === selected ? 'bold' : '400',
          }]}
        >{title}
        </Text>
      </View>
    </Pressable>
  )
}

export default FooterItem