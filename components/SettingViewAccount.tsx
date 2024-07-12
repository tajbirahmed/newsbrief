import React from 'react'
import { Text, View } from './Themed'
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated'
import { MD2Colors, MD3Colors } from 'react-native-paper'
import { useTailwind } from 'tailwind-rn'
import { Delete, LogOut, Trash2 } from 'lucide-react-native'
import { Dimensions, Pressable } from 'react-native'

const SettingViewAccount = () => {
	const tw = useTailwind();
	const {
		height,
		width
	} = Dimensions.get('window');
	
	const handleSignOut = () => {

	}

	const handleDeleteAccount = () => { 
		
	}

	return (
		<Animated.View entering={SlideInLeft} exiting={SlideOutLeft}>
			<Pressable style={[tw("flex flex-col m-4"), {
				backgroundColor: MD2Colors.blueGrey900,
				height: 'auto',
				borderRadius: 30,
			}]}
			onPress={handleSignOut}
				
			>
				<View style={[tw("flex flex-row items-center justify-between m-4"), {
					backgroundColor: 'transparent',
					width: width * 0.2
				}]}>
					<LogOut size={24} color={MD2Colors.green800} />
					<Text style={[tw("font-bold"), {

					}]}>
						Sign Out
					</Text>
				</View>
			</Pressable>
			<Pressable style={[tw("flex flex-col m-4"), {
				backgroundColor: MD2Colors.blueGrey900,
				height: 'auto',
				borderRadius: 30,
			}]}
			onPress={handleDeleteAccount}
			>
				<View style={[tw("flex flex-row items-center justify-between m-4"), {
					backgroundColor: 'transparent',
					width: width * 0.29
				}]}>
					<Trash2 size={24} color={MD3Colors.error50} />
					<Text style={[tw("font-bold"), {

					}]}>
						Delete Acccout
					</Text>
				</View>
			</Pressable>
		</Animated.View>

	)
}

export default SettingViewAccount