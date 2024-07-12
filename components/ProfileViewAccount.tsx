import React, { useState } from 'react'
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated'
import { Text, View } from './Themed'
import { Dimensions, Pressable } from 'react-native'
import { useTailwind } from 'tailwind-rn'
import { MD2Colors } from 'react-native-paper'
import { Pen } from 'lucide-react-native'
import { useEmail } from '@/contexts/EmailContext'
import { Timestamp } from 'firebase/firestore'
import { UserType } from '@/screen/ProfileEditScreen'
import { router } from 'expo-router'

type ProfileViewAccountType = {
    userName: string;
    
}

const ProfileViewAccount = ({
    currUser
}: {
    currUser : UserType
}) => {
    
    const { 
        height, 
        width
    } = Dimensions.get('window');
    
    const tw = useTailwind(); 
   
    const {
        email,
        setEmail
    } = useEmail(); 


    const handleProfileEdit = () => {
        router.push("/home/accountedit/")
    }

    const formatDate = (timestamp: Timestamp): string => {
        const date = timestamp.toDate();
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        });
    };

  return (
      <Animated.View entering={SlideInLeft} exiting={SlideOutLeft}>
          <View style={[tw("flex flex-col m-4"), {
              backgroundColor: MD2Colors.blueGrey900,
              height: 'auto', 
              borderRadius: 30,
          }]}>
              <View style={[tw("flex flex-row justify-between items-center m-4"), {
                  backgroundColor: 'transparent',
                  // height: height * 0.07,
              }]}>
                  <Text style={{ fontWeight: '300', fontSize: 17, }}>
                      Basic info
                  </Text>
                  <Pressable onPress={handleProfileEdit}>
                      <Pen color={'white'} size={18} />
                  </Pressable>
              </View>
              <View style={{
                  backgroundColor: 'gray',
                  height: '0.1%',
                  width: '100%',
                  marginVertical: 3,
              }} />
              <View style={[tw("flex flex-col m-4"), {
                  backgroundColor: 'transparent',
              }]}>
                  <Text style={{ fontWeight: '300', fontSize: 18, }}>
                      Username
                  </Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, }}>
                      {currUser.userName}
                  </Text>
              </View>
              <View style={{
                  backgroundColor: 'gray',
                  height: '0.1%',
                  width: '100%',
                  marginVertical: 3,
              }} />
              <View style={[tw("flex flex-col m-4"), {
                  backgroundColor: 'transparent',
              }]}>
                  <Text style={{ fontWeight: '300', fontSize: 18, }}>
                      Email
                  </Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, }}>
                      {email}
                  </Text>
              </View>
              <View style={{
                  backgroundColor: 'gray',
                  height: '0.1%',
                  width: '100%',
                  marginVertical: 3,
              }} />
              <View style={[tw("flex flex-col m-4"), {
                  backgroundColor: 'transparent',
              }]}>
                  <Text style={{ fontWeight: '300', fontSize: 18, }}>
                      BirthDay
                  </Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, }}>
                      {currUser.dateOfBirth
                          ?
                          formatDate(currUser.dateOfBirth)
                          :
                          "Not set yet"
                      }
                  </Text>
              </View>
              <View style={{
                  backgroundColor: 'gray',
                  height: '0.1%',
                  width: '100%',
                  marginVertical: 3,
              }} />

              <View style={[tw("flex flex-col m-4"), {
                  backgroundColor: 'transparent',
              }]}>
                  <Text style={{ fontWeight: '300', fontSize: 18, }}>
                      Gender
                  </Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, }}>
                      {currUser.gender
                          ?
                          currUser.gender
                          :
                          "Not set yet"
                      }
                  </Text>
              </View>

          </View>
          
      </Animated.View>
  )
}

export default ProfileViewAccount