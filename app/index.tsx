
import RegisterScreenTopComponent from '@/components/RegisterScreenTopComponent';
import { Text, View } from '@/components/Themed'
import { useAuth } from '@/contexts/AuthContext';
import { PassProvider } from '@/contexts/PasswordContext';
import CreateAccount from '@/screen/CreateAccount';
import Login from '@/screen/Login';
import { ChevronLeft } from 'lucide-react';

import React, { useState } from 'react'
import { StyleSheet } from 'react-native';
import { useTailwind } from 'tailwind-rn';

const Home = () => {
	
	const {
		user,
		setUser
	} = useAuth();
	const tw = useTailwind();
	
	const [screen, setScreen] = useState<boolean>(true)

	return (
		<View
			style={[tw("p-4 flex flex-col justify-between"), { flex: 1 }]}
		>
				<RegisterScreenTopComponent
				screen={screen}
				setScreen={setScreen}
				/>
			<PassProvider>
				{screen
					?
					(
						<Login
							screen={screen}
							setScreen={setScreen}
						/>
					)
					:
					<CreateAccount
						screen={screen}
						setScreen={setScreen}
					/>
				}
			</PassProvider>
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