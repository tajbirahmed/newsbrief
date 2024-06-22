import React from 'react'
import { View } from '@/components/Themed'
import { useTailwind } from 'tailwind-rn'
import { Dimensions } from 'react-native';
import HeaderBar from '@/components/Header';
import { useDrawer } from '@/contexts/DrawerContext';


const Home = () => {
  const tw = useTailwind();
  const {
    open,
    setOpen
  } = useDrawer();
  
  return (
    <View style={[{
      flex: 1,
      backgroundColor: 'red',
      height: Dimensions.get('window').height + 30, 
      position: 'absolute', 
      zIndex: 10,
      minWidth: '100%',
      }]}>
      <HeaderBar
        open={open}
        setOpen={setOpen}
      />
    </View> 
  )
}

export default Home