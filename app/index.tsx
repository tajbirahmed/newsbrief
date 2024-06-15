import { View } from '@/components/Themed'
import { useAuth } from '@/contexts/AuthContext';
import React from 'react'
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

const Home = () => {
  const {
    user,
    setUser
  } = useAuth();
  return (
      <View
          style={{ flex: 1}}
      >
      {user == null
        ?
        <View>
          
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