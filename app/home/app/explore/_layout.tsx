import HeaderBar from '@/components/Header'
import HorizontalCategoryComponent from '@/components/HorizontalCategoryComponent'
import { View } from '@/components/Themed'
import { useDrawer } from '@/contexts/DrawerContext'
import { useScreen } from '@/contexts/ScreenContext'
import { Slot } from 'expo-router'
import React, { useEffect } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { MD2Colors } from 'react-native-paper'
import { useTailwind } from 'tailwind-rn'



const ExploreLayout = () => {

	const {
		open,
		setOpen
	} = useDrawer();

	const {
		screen,
		setScreen
	} = useScreen(); 

	const tw = useTailwind();

	useEffect(() => {
		setScreen("Explore");
	}, []);

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

				<Slot />
			</ScrollView>
		</View>
	)
}

export default ExploreLayout