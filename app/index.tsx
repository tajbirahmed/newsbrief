import { View, Text } from '@/components/Themed'
import { useAuth } from '@/contexts/AuthContext';
import { DarkTheme } from '@react-navigation/native';
import React, { useState } from 'react'
import { StyleSheet, useColorScheme } from 'react-native';
import { DefaultTheme, TextInput } from 'react-native-paper';
import { useTailwind } from 'tailwind-rn';

const Home = () => {
  const {
    user,
    setUser
  } = useAuth();
  const tw = useTailwind();
  const [email, setEmail] = useState('');
  const bgval = useColorScheme() == 'dark' ? DarkTheme : DefaultTheme;
  const colVal = bgval === DarkTheme ? 'white' : 'black';
  return (
      <View
          style={[tw("p-12") , { flex: 1}]}
      >
      {user === null
        ?
        <View style={tw("flex flex-col justify-center")}>
          <TextInput 
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            mode='outlined'
            theme={bgval}
            textColor={colVal}
            cursorColor={colVal}
            outlineStyle={{
              borderColor: 'gray'
            }}
          />
        </View>
        :
        <>
          
        </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  login_screen: {
    display: 'flex', 
    flexDirection: 'row'
  }
})

export default Home;