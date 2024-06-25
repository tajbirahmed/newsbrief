import FooterBar from '@/components/FooterBar';
import HeaderBar from '@/components/Header';
import { View } from '@/components/Themed';
import DrawerScreen from '@/screen/DrawerScreen';
import { Slot } from 'expo-router'
import React from 'react'
import { Dimensions, ScrollView } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { useTailwind } from 'tailwind-rn';
import Constants from 'expo-constants';
import { useDrawer } from '@/contexts/DrawerContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { ScreenProvider } from '@/contexts/ScreenContext';



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
			<ScreenProvider>
				<CategoryProvider>
					<Slot />
				</CategoryProvider>

				<FooterBar />
			</ScreenProvider>
		</Drawer>
	)
}

export default HomeRootLayout