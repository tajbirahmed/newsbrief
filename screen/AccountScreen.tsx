import CountMesaageComponent from '@/components/CountMesaageComponent';
import CustomButton from '@/components/CustomButton';
import { Text, View } from '@/components/Themed'
import { BLURHASH } from '@/constants/BLURHASH';
import NewsCategories from '@/constants/NewsCategories';
import { useEmail } from '@/contexts/EmailContext';
import { useProfileImage } from '@/contexts/ProfileImageUrlContext';
import { DB, FIREBASE_AUTH } from '@/firebase/FirebaseConfig';
import {  MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { onAuthStateChanged } from 'firebase/auth';
import {  doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Dimensions, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Divider, MD2Colors } from 'react-native-paper';
import { useTailwind } from 'tailwind-rn'
const AccountScreen = () => {
    const tw = useTailwind();
    const {
        email, 
        setEmail
    } = useEmail(); 

    const {
        profileImageUrl,
        setProfileImageUrl
    } = useProfileImage(); 

    const HEIGHT = Dimensions.get('window').height;
    const [favCategory, setFavCategory] = useState<Set<string>>(new Set()); 
    // const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null); 
    const [displayName, setDisplayName] = useState<string | null>(null); 
    const [creationTime, setCreationTime] = useState<string | null>(null)
    

    const saveDataToCache = async (key: string, data: any) => {
        try {
            const jsonData = JSON.stringify(data);
            await AsyncStorage.setItem(key, jsonData);

        } catch (error) {
            console.error('Error saving data to cache:', error);
        }
    };

    const formatDate = (dateString: string) : string=> {
        const date = new Date(dateString);

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${dayName}, ${day} ${month}, ${year}`;
    };

    // const getRandomImage = async () => {
    //     const category = 'nature';
    //     const url = `https://api.api-ninjas.com/v1/randomimage?category=${category}`;

    //     const axiosInstance = axios.create({
    //         method: 'GET',
    //         baseURL: 'https://api.api-ninjas.com/v1/randomimage',
    //         timeout: 5000,
    //         headers: {
    //             'X-Api-key': process.env.EXPO_PUBLIC_API_KEY_API_NINJA!, 
    //             'Accept': 'Image/jpg'
    //         }, 
    //         params: {
    //             category: category
    //         }, 
    //         responseType: 'arraybuffer',
    //     });

    //     const image = await fetchData({
    //         axiosInstance,
    //         url
    //     });
        
    //     setRandomImageUrl(image.data); 
        
    // }

    const getFavCategory = async (key: string) : Promise<boolean> => {
        try {
            const jsonData = await AsyncStorage.getItem(key);
            if (jsonData != null) {
                const res = await JSON.parse(jsonData);
                
                const newSet: Set<string> = new Set<string>(res);

                setFavCategory(newSet);
                
                return true; 
            }
        } catch (error) {
            console.error('Error retrieving next page data from cache:', error);
            return false; 
        }
        return false; 
    }

    const handleCateory = async () => { 
        const cacheStatus = await getFavCategory('favCategories');
        if (cacheStatus) return;
        
        
        const saveToDB = async () => { 
            
            
            try {
                
                
                if (!email) return false; 
                const userDocRef = doc(DB, "User", email.toLowerCase());
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const favCategories = docSnap.data().fav_category;
                    if (favCategories) {
                        const newSet: Set<string> = new Set<string>(favCategories);
                        
                        setFavCategory(newSet);
                        await saveDataToCache('favCategories', favCategories);
                       
                       
                        
                        return true;
                    } else {
                        console.log("[AccountScreen.tsx] No such field 'fav_category'!");
                        return false; 
                    }
                } else {
                    console.log("[AccountScreen.tsx] No such document fav category!");
                    return false; 
                }
            } catch (error) {
                console.error("[AccountScreen.tsx] Error getting document:", error);
                return false; 
            }
        }
        const status = await saveToDB();
        if (status) return; 
    }

    const toUpper = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    

    const handlePress = async (categoryName: string) => { 
        let newSet = new Set(favCategory);

        if (newSet.has(categoryName)) {
           
            newSet.delete(categoryName);
        } else {
            
            newSet.add(categoryName);
        }

        setFavCategory(newSet);
        await saveDataToCache('favCategories', Array.from(newSet));
        const docRef = doc(DB, "User", email?.toLowerCase()!);
        await updateDoc(docRef, {
            fav_category: Array.from(newSet)
        });
    }

    useEffect(() => { 
        handleCateory(); 
    }, [])

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                setEmail(user.email!);
                if (user.photoURL)
                    setProfileImageUrl(user.photoURL); 
                setDisplayName(user.displayName); 
                setCreationTime(user.metadata.creationTime!)
            }
         })
    }, [])



    return (
        <View style={[tw(""), {
            flex: 1,
            // backgroundColor: MD2Colors.blue300
        }]}>
            <ScrollView style={[tw("flex flex-col"), {
                backgroundColor: 'transparent',
                height: 'auto',
                paddingBottom: 40,
            }]}>
                

                
                    <Image
                         source={{
                        uri: 'https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        }}
                        placeholder={BLURHASH}
                        style={{
                            width: Dimensions.get('window').width,
                            height: HEIGHT * 0.30,
                        }}
                    />
               
                <View style={{ 
                    height: 160,
                    width: 160, 
                    borderRadius: 80,
                    position: 'absolute', 
                    top: HEIGHT * 0.20,
                    left: Dimensions.get('window').width * 0.50  - 80,
                    zIndex: 11,
                    borderWidth: 3, 
                    borderColor: MD2Colors.blue800, 
                    borderEndColor: MD2Colors.green400, 
                    borderEndWidth: 2,

                } }>
                    <Image
                        source={profileImageUrl}
                        placeholder={BLURHASH}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 80, 
                        }}
                    />
                </View>
                <View style={{
                    height: HEIGHT * 0.1,
                    backgroundColor: 'transparent'
                }}>

                </View>
                <View style={[tw("flex flex-col items-center"), {
                    backgroundColor: 'transparent',
                }]}>
                    <Text
                        style={{
                            fontSize: 18, 
                            fontWeight: 'semibold', 
                            paddingVertical: 4, 
                        }}
                    >{displayName}</Text>
                    <Text
                        style={{
                            fontSize: 13, 
                            fontWeight: 'medium', 
                            paddingVertical: 4, 

                        }}
                    >{creationTime ? formatDate(creationTime) : null}</Text>
                    <View style={[tw("flex flex-row items-center"), {
                        backgroundColor: 'transparent',
                        
                    }]}>
                        <MaterialIcons name='location-pin' color={'white'} size={24} /> 
                        <Text
                            style={{
                                fontSize: 13, 
                                fontWeight: 'medium', 
                                paddingVertical: 4, 
                            }}>
                            Location, Location
                            </Text>
                    </View>
                </View>

                <View style={[tw("flex flex-row items-center justify-around"), {
                    backgroundColor: 'transparent',
                    marginVertical: 14, 
                }]}>
                    <CountMesaageComponent
                        count={10000}
                        message={'articles read'}
                    />
                    <CountMesaageComponent
                        count={100}
                        message={'likes'}
                    />
                    <CountMesaageComponent
                        count={34}
                        message={'favorites'}
                    />
                </View>

                <View style={[tw("flex flex-row justify-around"), {
                    backgroundColor: 'transparent', 
                    paddingHorizontal: 8, 
                }]}>
                    <CustomButton
                        buttonLabel={"Edit Profile"}
                    />
                    
                </View>

                <View style={[tw("flex flex-col p-4")]}>
                    <Text style={[tw(""), {
                        fontSize: 20, 
                        fontWeight: 'semibold',
                        marginBottom: 8, 
                    }]}>
                        Manage Categories
                    </Text>
                    <Divider style={{ marginBottom: 8 }} />
                    <View style={[tw("flex flex-row justify-around"), {
                        overflow: 'visible', 
                        flexWrap: 'wrap',
                    }]}>
                        {NewsCategories.map((category, index) => (
                            <Pressable
                                key={index}
                                style={[tw("flex flex-row items-center justify-around"), {
                                    backgroundColor: favCategory.has !== undefined && favCategory.has(category.categoryName) ? MD2Colors.green800 : "transparent",
                                    borderRadius: 20,
                                    height: 35,
                                    minWidth: 80,
                                    padding: 8,
                                    margin: 4,
                                    borderColor: 'white',
                                    borderWidth: 1,
                                }]}
                                onPress={() => { 
                                    handlePress(category.categoryName);
                                }}
                            >
                                <Text
                                    key={index}
                                >
                                    {toUpper(category.categoryName)}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </View>
    )
}

export default AccountScreen

const styles = StyleSheet.create({
   
});