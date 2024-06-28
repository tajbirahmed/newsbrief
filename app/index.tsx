import RegisterScreenTopComponent from '@/components/RegisterScreenTopComponent';
import { View } from '@/components/Themed'
import { useAuth } from '@/contexts/AuthContext';
import { PassProvider } from '@/contexts/PasswordContext';
import { FIREBASE_AUTH } from '@/firebase/FirebaseConfig';
import CreateAccount from '@/screen/CreateAccount';
import Login from '@/screen/Login';
import { Redirect, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';

import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native';
import { useTailwind } from 'tailwind-rn';



const Home = () => {
	
	const {
		user,
		setUser
	} = useAuth();
	const tw = useTailwind();
	
	const [screen, setScreen] = useState<boolean>(true)

	useEffect(() => {
		onAuthStateChanged(FIREBASE_AUTH, (user) => {
			setUser(user);
			// router.replace("/home/app/explore/");
		})
	}, []);

	useEffect(() => {
		if (user) {
			router.replace("/home/article/view/2/");
		}
	}, [user]);
	
	// if (user) {
		
	// 	alert("Welcome back!");
	// 	return <Redirect href="/home/app/explore/" />
	// }

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