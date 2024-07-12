import { CustomTextInput } from '@/components/CustomTextInput';
import { Text, View } from '@/components/Themed'
import { useEmail } from '@/contexts/EmailContext';
import { DB, FIREBASE_AUTH } from '@/firebase/FirebaseConfig';
import { UserType } from '@/screen/ProfileEditScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { DarkTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import { User, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Calendar, FolderPen, Lock, MailCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react'
import { Dimensions, Pressable, ScrollView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { ActivityIndicator, Button, MD2Colors, MD3Colors, TextInput } from 'react-native-paper';
import { useTailwind } from 'tailwind-rn'
	

const AccountEditHome = () => {
	const tw = useTailwind();

	const {
		email,
		setEmail
	} = useEmail(); 

	const {
		height,
		width
	} = Dimensions.get('window'); 

	const data2 = [
		{
			key: '1',
			value: 'male',
		},
		{
			key: '2',
			value: 'female'
		},
		{
			key: '3',
			value: 'other'
		},


	]

	const [displayName, setDisplayName] = useState<string | undefined>(undefined);
	const [user, setUser] = useState<User | null>(null);
	const [currUser, setCurrUser] = useState<UserType | undefined>(undefined)
	const [show, setShow] = useState<boolean>(false); 
	const [dob, setDob] = useState<Timestamp | undefined>(undefined); 
	const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(undefined); 
	const [loading, setLoading] = useState<boolean>(false);

	const handleDisplayName = async () => {

		updateProfile(user!, {
			displayName: displayName
		}).then(() => {

		}).catch((e) => {
			console.log(e);
		})


	}

	const getUserName = async () => {
		const docRef = doc(DB, 'User', email!);
		try {
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				// console.log(docSnap.data());
				setCurrUser(docSnap.data() as UserType);
			} else {
				console.log("No such user!");
			}
		} catch (error) {
			throw new Error("[ProfileEditScreen.tsx]" + error)
		}

	}

	const handleDatePicker = () => { 
		setShow(true);
	}

	const convertTimestampToDate = (timestamp: Timestamp): Date => {
		return timestamp.toDate();
	};

	const convertDateToTimestamp = (date: Date): Timestamp => {
		return Timestamp.fromDate(date);
	};

	const handleDateChange = (event: DateTimePickerEvent, date?: Date | undefined) => { 
		const {
			type,
			nativeEvent: { timestamp, utcOffset },
		} = event;
		if (type === "set" && date) {
			setDob(convertDateToTimestamp(date));
		}
		
		setShow(false);
	}

	const getDay = (timestamp: Timestamp): string => {
		const date = timestamp.toDate();
		return date.getDate().toString();
	};

	const getMonth = (timestamp: Timestamp): string => {
		const date = timestamp.toDate();
		const options: Intl.DateTimeFormatOptions = { month: '2-digit' };
		return date.toLocaleDateString('en-US', options);
	};

	const getYear = (timestamp: Timestamp): string => {
		const date = timestamp.toDate();
		return date.getFullYear().toString();
	};

	const handleGenderSelect = () => { 
		console.log(gender);
	}

	const handleCancel = () => { 
		const check = dob || gender; 
		if (check) { 
			alert("Changes is not saved");
		}
		router.back(); 
	}

	const handleSave = async () => { 
		const check = dob || gender; 
		if (email && check) {
			setLoading(true);
			const docRef = doc(DB, 'User', email);
			let updateData= {}; 
			if (dob) {
				updateData = {
					dateOfBirth: dob, 
				}
			}
			if (gender) {
				updateData = {
					...updateData, 
					gender: gender, 
				}
			}
			try {
				await updateDoc(docRef, updateData)
			} catch (error) {
				console.log("[accountedit/index.tsx] " + error);
			} finally {
				setLoading(false)
			}
		} else { 
			console.log("[accountedit/index.tsx] email not exists");
		}
		if (!check) {
			alert('Nothing is changed');
		}
	}

	useEffect(() => {
		if (email) {
			getUserName();
		}
	}, [email])

	useEffect(() => {
		onAuthStateChanged(FIREBASE_AUTH, async (currUser1) => {
			if (currUser1) {
				setUser(currUser1);
				setEmail(currUser1.email);
				setDisplayName(currUser1.displayName!);
				
			}
		})
	}, [])

	return (
		<View style={[tw("m-2"), {
			flex: 1,
			backgroundColor: 'transparent',
			height: Dimensions.get('window').height + 30,
			zIndex: 10,
			minWidth: '100%',
			zindex: -21,
			padding: 5,
		}]}
		>
			{!currUser
				?
				(
					<ActivityIndicator size={'small'} color={MD2Colors.blue600} style={{marginTop: height / 2 - 50}} />
				)
				:
				(
					<ScrollView style={[tw("flex flex-col"), {
						backgroundColor: 'transparent',
						height: 'auto',
						paddingBottom: 40,
					}]}>
						<View style={[tw("flex flex-row items-center"), { paddingLeft: 10, }]}>
							<FolderPen size={20} color={'white'} />
							<Text style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10, }}>
								Display Name
							</Text>
						</View>
						<View>
							<CustomTextInput
								label={'Display Name'}
								content={displayName!}
								setContent={setDisplayName}
								onChange={() => {
									setDisplayName(displayName)
								}}
								onEndEditing={handleDisplayName}
							/>
						</View>
						<View style={[tw("flex flex-row items-center"), { paddingLeft: 10, marginTop: 15 }]}>
							<Lock size={20} color={'white'} />
							<Text style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10, }}>
								User Name
							</Text>
						</View>
						<View>

							<CustomTextInput
								label={'User Name'}
								content={currUser.userName!}
								setContent={() => { }}
								readonly={true}
							/>

						</View>
						<View style={[tw("flex flex-row items-center"), { paddingLeft: 10, marginTop: 15 }]}>
							<MailCheck size={20} color={'white'} />
							<Text style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10, }}>
								Email
							</Text>
						</View>
						<View>
							<CustomTextInput
								label={'Email'}
								content={email!}
								setContent={() => { }}
								readonly={true}
							/>
						</View>

						<View style={[tw("flex flex-row items-center"), { paddingLeft: 10, marginTop: 15 }]}>
							<Calendar size={20} color={'white'} />
							<Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10, }}>
								Birthday
							</Text>
						</View>
						<Pressable
							style={[tw("flex flex-row justify-around pt-2")]}
							onPress={handleDatePicker}
						>
							{currUser.dateOfBirth
								?
								<>
									<TextInput
										label={'Day'}
										mode='outlined'
										value={getDay(currUser.dateOfBirth)}
										textColor='white'
										theme={DarkTheme}
										readOnly={true}
									/>
									<TextInput
										label={'Month'}
										mode='outlined'
										theme={DarkTheme}
										textColor='white'
										value={getMonth(currUser.dateOfBirth)}
										readOnly={true}
									/>
									<TextInput
										label={'Year'}
										mode='outlined'
										theme={DarkTheme}
										textColor='white'
										value={getYear(currUser.dateOfBirth)}
										readOnly={true}
									/>
									{show ? (
										<RNDateTimePicker
											testID="dateTimePicker"
											value={convertTimestampToDate(currUser.dateOfBirth)}
											mode={'date'}
											onChange={handleDateChange}
											themeVariant='dark'
											display="spinner"
										/>
									)
										:
										(null
									)}
								</>
								:
								<Text style={{ fontWeight: 'bold', fontSize: 18}}>
									Set Date of Birth
								</Text>
							}
						</Pressable>
						
						<View style={[tw("flex flex-row items-center"), { paddingLeft: 10, marginTop: 15 }]}>
							<MaterialCommunityIcons name="gender-male-female-variant" size={20} color={'white'} />
							<Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10, }}>
								Gender
							</Text>
						</View>
						<View style={[tw("self-center mt-2 mb-20"), {width: width * 0.88}]}>
							<SelectList
								setSelected={(val: 'male' | 'female' | 'other') => setGender(val)}
								data={data2}
								save="value"
								inputStyles={{ color: 'white' }}
								// searchicon={<Search color={'white'} size={14} style={{ marginRight: 10, }} />}
								// closeicon={
								// 	<X color={'white'} size={14} style={{ marginLeft: 10, }} />

								// }
								// boxStyles={{ backgroundColor: 'white' }}
								//   dropdownStyles={{ backgroundColor: 'yellow', borderColor: 'red' }}
								dropdownTextStyles={{ color: 'white' }}
								dropdownItemStyles={{
									margin: 1, 
									
								}}
								dropdownShown={false}
								disabledTextStyles={{ color: 'gray' }}
								placeholder='Choose gender'
								onSelect={handleGenderSelect}
								search={false}
							/>
						</View>
						<View style={[tw("flex self-end flex-row justify-around"), {
							// backgroundColor: 'yellow', 
							height: 100, 
							width: width * 0.6,
						}]}>
							<Pressable
								onPress={handleCancel}
								style={[tw("flex flex-row justify-around items-center"), {
									width: width * 0.16,
									backgroundColor: MD3Colors.error50,
									height: height * 0.045,
									borderRadius: 10,
								}]}
							>
								<Text style={[tw(""), {
									fontWeight: 'bold'
								}]}>Cancel</Text>
							</Pressable>
							<Button
								loading={loading}
								onPress={handleSave}
								style={[tw("flex flex-row justify-around items-center"), {
									width: width * 0.16,
									backgroundColor: MD2Colors.green700,
									height: height * 0.045,
									borderRadius: 10,
								}]}
							>
								<Text style={[tw(""), {
									fontWeight: 'bold'
								}]}>Save</Text>
							</Button>
						</View>
					</ScrollView>
				)	
			}
			
		</View>
	)
}

export default AccountEditHome