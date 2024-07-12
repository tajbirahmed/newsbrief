import React from 'react'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import { Text, View } from './Themed'
import { useTailwind } from 'tailwind-rn'
import { Dimensions, Pressable } from 'react-native'
import { MD2Colors } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useProfileImage } from '@/contexts/ProfileImageUrlContext'
import { BLURHASH } from '@/constants/BLURHASH'
import { UserType } from '@/screen/ProfileEditScreen'
import { useEmail } from '@/contexts/EmailContext'
import { Plus, Verified } from 'lucide-react-native'

const AccountViewAccount = ({
    currUser
}: {
    currUser: UserType
}) => {
    const tw = useTailwind(); 
    const {
        height,
        width
    } = Dimensions.get('window'); 

    const {
        profileImageUrl,
        setProfileImageUrl
    } = useProfileImage(); 

    const {
        email,
        setEmail
    } = useEmail();

    const handleAddNewAccount = () => {
        alert('Coming Soon.');

    }

    return (
      <Animated.View entering={SlideInRight} exiting={SlideInLeft}>
          <View style={[tw("self-center"), {
              height: height * 0.158,
              width: width * 0.9,
              backgroundColor: MD2Colors.blueGrey900,
              borderRadius: 30,

          }]}>

              <View style={[tw("flex flex-row items-center justify-between m-4"), {
                  backgroundColor: 'transparent',
                  width: width * 0.25
              }]}>
                  <MaterialIcons name='groups' size={24} color={MD2Colors.green800} />
                  <Text style={[tw("font-bold"), {
                      fontSize: 20,
                  }]}>
                      Account
                  </Text>
              </View>
              <View style={{
                  height: '1%',
                  width: '100%',
                  backgroundColor: 'gray',
              }} />
              <View style={[tw("flex flex-row items-center m-4 justify-between"), {
                  backgroundColor: 'transparent',
              }]}>
                  <View style={[tw("flex flex-row items-center"), {
                      backgroundColor: 'transparent',
                  }]}>

                      <Image
                          source={profileImageUrl}
                          placeholder={BLURHASH}
                          style={{
                              height: 36,
                              width: 36,
                              borderRadius: 18,
                          }}
                      />
                      <View
                          style={[tw("flex flex-col pl-2"), {
                              backgroundColor: 'transparent',

                          }]}

                      >
                          <Text style={[tw("font-bold"), {}]}>
                              {currUser?.userName}
                          </Text>
                          <Text style={[tw("font-normal"), {
                              // color: ''
                          }]}>
                              {email}
                          </Text>
                      </View>
                  </View>
                  <Verified size={24} color={MD2Colors.green800} />
              </View>
          </View>

          <Pressable style={[tw("self-center mt-6"), {
              height: height * 0.07,
              width: width * 0.9,
              backgroundColor: MD2Colors.blueGrey900,
              borderRadius: 25,

          }]}
              onPress={handleAddNewAccount}
          >
              <View style={[tw("flex flex-row items-center justify-between m-4"), {
                  backgroundColor: 'transparent',
                  width: width * 0.25
              }]}>
                  <Plus size={24} color={MD2Colors.green800} />
                  <Text style={[tw("font-bold"), {

                  }]}>
                      Add Account
                  </Text>
              </View>
          </Pressable>
      </Animated.View>
  )
}

export default AccountViewAccount