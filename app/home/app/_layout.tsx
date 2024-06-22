import FooterBar from '@/components/FooterBar';
import HeaderBar from '@/components/Header';
import { View } from '@/components/Themed';
import DrawerScreen from '@/screen/DrawerScreen';
import { Slot } from 'expo-router'
import React from 'react'
import { Dimensions } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { useTailwind } from 'tailwind-rn';
import Constants from 'expo-constants'; 
import { useDrawer } from '@/contexts/DrawerContext';



const HomeRootLayout = () => {
  const {
    open,
    setOpen
  } = useDrawer();
  const tw = useTailwind(); 
  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => {
        return (
          <DrawerScreen />
        )
      }}
      drawerStyle={{
        marginTop: Constants.statusBarHeight, 
        height: Dimensions.get('window').height, 
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,

      }}
    >
      <View style={[tw("flex flex-col"), {
        flex: 1,
        // minHeight: '100%', 
        flexGrow: 1,
        flexShrink: 0,
      }]}>
        
          <Slot />
      </View>
      <FooterBar />
    </Drawer>
  )
}

export default HomeRootLayout