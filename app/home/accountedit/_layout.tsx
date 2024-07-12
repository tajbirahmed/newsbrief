import { Text, View } from '@/components/Themed'
import { Slot } from 'expo-router'
import React from 'react'
import { useTailwind } from 'tailwind-rn'
import  Constants  from 'expo-constants'
import { Pressable } from 'react-native'
import { ChevronLeft } from 'lucide-react-native'
import { Divider } from 'react-native-paper'

const AccoundEditLayout = () => {
  const tw = useTailwind(); 
  return (
    <View style={[tw("flex flex-col"), { flex: 1 }]}>
      <View style={[tw("flex flex-row items-center"), {
        marginTop: Constants.statusBarHeight + 12,
        justifyContent: 'flex-start',
        paddingBottom: 5,
        marginLeft: 5,
        // marginTop: 2,
      }]}>
        <Pressable style={[tw("pl-2"), {
        }]}>
          <ChevronLeft size={20} color={'white'} />
        </Pressable>
        <View style={[, tw("items-center"), {
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          position: 'absolute',
          zIndex: -10,
        }]}>
          <Text style={[tw("font-bold text-lg"), {
            fontSize: 20,
          }]}>
            Edit Profile
          </Text>
          <Divider style={{ marginBottom: 5 }} />
        </View>
      </View>
      <Slot />
    </View>
  )
}

export default AccoundEditLayout