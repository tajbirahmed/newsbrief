import React, { useEffect } from 'react'
import { Text, View } from '@/components/Themed' 
import { MD2Colors } from 'react-native-paper'
import { Dimensions, ScrollView } from 'react-native'
import { useTailwind } from 'tailwind-rn'
import HeaderBar from '@/components/Header'
import { useDrawer } from '@/contexts/DrawerContext'
import { useScreen } from '@/contexts/ScreenContext'
import HorizontalCategoryComponent from '@/components/HorizontalCategoryComponent'


const ExploreHome = () => {
  const tw = useTailwind();
  
  const {
    open,
    setOpen
  } = useDrawer();

  const {
    screen,
    setScreen
  } = useScreen(); 

  useEffect(() => {
    setScreen('Explore');
  }, [])

  return (
    <View style={[tw(""), {
      flex: 1,
      backgroundColor: MD2Colors.black,
      height: Dimensions.get('window').height + 30,
      position: 'absolute',
      zIndex: 10,
      minWidth: '100%',


    }]}
    >
      <ScrollView style={[tw("flex flex-col"), {
        backgroundColor: 'transparent',
        height: 'auto',
        paddingBottom: 40,
      }]}>

        <HeaderBar
          open={open}
          setOpen={setOpen}
          meesage={"Explore in News"}
        />
        <HorizontalCategoryComponent 

        />
      </ScrollView>
    </View>
  )
}

export default ExploreHome