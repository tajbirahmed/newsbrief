import { Text, View } from '@/components/Themed'
import React, { useEffect, useState } from 'react'
import { Dimensions, Pressable } from 'react-native';
import { useTailwind } from 'tailwind-rn'

import { useProfileImage } from '@/contexts/ProfileImageUrlContext';
import { Image } from 'expo-image';
import { useUserName } from '@/contexts/UserNameContext';
import { useEmail } from '@/contexts/EmailContext';
import { DB, FIREBASE_AUTH } from '@/firebase/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Settings2, X } from 'lucide-react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { MD2Colors } from 'react-native-paper';
import { DrawerContentType, useDrawer } from '@/contexts/DrawerContext';

const DrawerScreen = () => {
	const tw = useTailwind();
	const { 
		height, 
		width
	} = Dimensions.get("window");

	const {
		selected,
		setSelected
	} = useDrawer(); 

	const { 
		profileImageUrl
	} = useProfileImage();

	const {
		userName, 
		setUserName
	} = useUserName(); 

	const {
		email,
		setEmail
	} = useEmail(); 


	const gotoRoute = (route : DrawerContentType) => { 
		if (!route) return;
		if (route === "google-news") {

		} else if (route === "settings") { 

		} else {

		}
	}

	useEffect(() => {
		// console.log("here");
		
		const getUserName = async () => {
			if (email) {
				const docRef = doc(DB, 'User', email.toLowerCase());
				try {
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						// console.log(docSnap.data());
						setUserName(docSnap.data().userName);
					} else {
						console.log("No such user!");
					}
				} catch (error) {
					throw new Error("[DraweScreen.tsx]" + error)
				}
			}
			
		};
		getUserName();

	}, [email]);
	useEffect(() => { 
		onAuthStateChanged(FIREBASE_AUTH, (user) => {
			if (user?.email)
				setEmail(user?.email)
		})
	}, [])

	return (
		<View style={tw("flex flex-1 flex-col pt-3 px-1")}>
			<View style={[tw("rounded-lg flex flex-col"), {

				height: height * 0.21,
				backgroundColor: "#11121c",
				width: '100%', 
				shadowColor: 'black', 
			},]}>

				<Image
					source={{ uri: profileImageUrl }}
					style={[tw("rounded-full"), {
						height: height * 0.1,
						width: height * 0.1,
						marginTop: 10,
						marginLeft: 10
					}]}
				/>
				<View style={[tw("mx-4 mt-2"), {
					backgroundColor: 'transparent',
				}]}>
				{
					userName !== ''
						?
						<Text style={tw("text-3xl")}>
							{userName.charAt(0).toUpperCase() + userName.slice(1)}
						</Text>
						: <Text style={tw("text-lg")}>
							{""}
						</Text>
				}
				</View>
				<View style={[tw("mx-4 mt-1"), {
					backgroundColor: 'transparent',
				}]}>
					<Text style={[tw("font-normal")]}>
						{email}
					</Text>
				</View>
			</View>
			<View style={{
				backgroundColor: 'white',
				width: '100%', 
				height: '0.05%',
			}} />
			<View style={[tw("flex flex-col mx-2 px-2 mt-6"), {
				// backgroundColor: 'white'
			}]}>
				
				<Pressable style={[tw("flex flex-row items-center rounded-lg"), {
					backgroundColor: selected === "google-news" ? MD2Colors.blueGrey900 : 'transparent', 
				}]}
					onPress={() => { 
						setSelected("google-news");
						gotoRoute("google-news"); 
					}}
				>
					<View style={[tw("flex flex-row justify-center w-12 h-12 pr-2 items-center"), {
						backgroundColor: 'transparent',
					}]}>
						<FontAwesome6 name="google" size={24} color="white" />
					</View>
					<View style={[tw("flex flex-row items-center"), {
						backgroundColor: 'transparent',
					}]}>
						<Text style={[tw("font-semibold"), {
							fontSize: 18, 
						}]}>
							Google News
						</Text>
					</View>
				</Pressable>

				<Pressable style={[tw("flex flex-row items-center rounded-lg mt-4"), {
					backgroundColor: selected === "settings" ? MD2Colors.blueGrey900 : 'transparent',
				}]}
					onPress={() => {
						setSelected("settings");
						gotoRoute("settings");
					}}
				>
					<View style={[tw("flex flex-row justify-center w-12 h-12 pr-2 items-center"), {
						backgroundColor: 'transparent',
					}]}>
						<Settings2  size={24} color="white" />
					</View>
					<View style={[tw("flex flex-row items-center"), {
						backgroundColor: 'transparent',
					}]}>
						<Text style={[tw("font-semibold"), {
							fontSize: 18,
						}]}>
							Setting
						</Text>
					</View>
				</Pressable>
				
			</View>
		</View>
	)
}

export default DrawerScreen

