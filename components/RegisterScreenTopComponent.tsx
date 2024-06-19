import React from 'react'
import { Pressable, Text } from 'react-native'
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { useTailwind } from 'tailwind-rn'
import { RegisterPageType } from '@/types/RegisterPageType';


const RegisterScreenTopComponent = ({
	screen,
	setScreen
}: RegisterPageType) => {

	const tw = useTailwind();

	return (


		<Animated.View style={[tw("flex flex-col items-center justify-center pt-4"), {
			height: screen ? '33%' : 55,
			alignItems: !screen ? 'flex-end' : 'center',

		}]}
			entering={SlideInUp}
			exiting={SlideOutUp}
		>

			<Pressable onPress={() => {
				!screen && setScreen(true);
			}}>
				<Text style={[tw("flex flex-row text-4xl font-bold"), {
					color: screen ? "white" : "#e07c24", fontFamily: 'monospace',
					fontSize: !screen ? 12 : 24,
					borderColor: 'gray', borderWidth: !screen ? 0.5 : 0,
					padding: 4,
					width: !screen ? '13%' : '50%',
					borderRadius: 10,
				}]}>

					{screen ? "Newsbiref..." : "Login"}
				</Text>
			</Pressable>
		</Animated.View>
	)
}

export default RegisterScreenTopComponent