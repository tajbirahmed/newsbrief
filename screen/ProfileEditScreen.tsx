import CustomButton from '@/components/CustomButton'
import { Text, View } from '@/components/Themed'
import { BLURHASH } from '@/constants/BLURHASH'
import { useProfileImage } from '@/contexts/ProfileImageUrlContext'
import { DB, FIREBASE_AUTH, FIREBASE_STORAGE } from '@/firebase/FirebaseConfig'
import { Image } from 'expo-image'
import { User, onAuthStateChanged, updatePassword, updateProfile } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Dimensions, NativeEventEmitter, Pressable, ScrollView } from 'react-native'
import { MD2Colors, MD3Colors, Modal, PaperProvider, Portal } from 'react-native-paper'
import { useTailwind } from 'tailwind-rn'
import * as ImagePicker from 'expo-image-picker';
import { useEmail } from '@/contexts/EmailContext'
import { StringFormat, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { CustomTextInput } from '@/components/CustomTextInput'
import { Timestamp, collection, doc, getDoc, query, where } from 'firebase/firestore'
import { Camera, ChevronDown, Edit, FolderPen, GalleryHorizontal, ImageIcon, ImagePlus, KeyRound, Lock, Mail, MailCheck, MailX, Pen, Plus, Verified } from 'lucide-react-native'
import Animated, { SlideInDown, SlideInLeft, SlideInRight, SlideOutDown, SlideOutLeft } from 'react-native-reanimated'
import { MaterialIcons } from '@expo/vector-icons'
import ProfileViewAccount from '@/components/ProfileViewAccount'
import AccountViewAccount from '@/components/AccountViewAccount'
import SettingViewAccount from '@/components/SettingViewAccount'

export interface UserType { 
    dateJoined?: Timestamp; 
    dateOfBirth?: Timestamp; 
    latitude?: string, 
    longtitude?: string, 
    phoneNumber?: string,
    gender?: 'male' | 'female' | 'other',
    userName?: string, 
} 

const ProfileEditScreen = () => {

    const {
        email,
        setEmail
    } = useEmail();

    const {
        profileImageUrl,
        setProfileImageUrl
    } = useProfileImage();

    const [user, setUser] = useState<User | null>(null);
    const [trigger, setTrigger] = useState<boolean>(false);
    const [trigger2, setTrigger2] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [option, setOption] = useState<'account' | 'profile' | 'setting'>('account');
    const [currUser, setCurrUser] = useState<UserType | undefined>(undefined)
    const {
        height,
        width
    } = Dimensions.get('window');

    const tw = useTailwind();

    const handleStorage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 0.3,
        });
        if (!result.canceled) {
            setProfileImageUrl(result.assets[0].uri)
            setTrigger2(true);
        }
        setShowModal(false);
    }

    const handleCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            // mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            cameraType: ImagePicker.CameraType.front,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.3,
        });
        if (!result.canceled) {
            setProfileImageUrl(result.assets[0].uri);
            setTrigger2(true);
        }
        else if (result.canceled) {
            alert('Capture an image to set as profile picture.')
        }
        setShowModal(false);
    }

    const handleImageLink = async () => {

    }

    const uploadImageFirebaseStorage = async () => {
        const blob = await new Promise<Blob>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", profileImageUrl, true);
            xhr.send(null);
        });
        const fileExtenstion = profileImageUrl.split('.').pop();
        const photoRef = ref(FIREBASE_STORAGE, `ProfileImages/${email}.${fileExtenstion}`);
        uploadBytes(photoRef, blob)
            .then((snapshot) => {
                setTrigger(true);

            }).catch((e) => {
                console.log(e)
            }
            )

    }

    const getImageUrl = async () => {
        const fileExtenstion = profileImageUrl.split('.').pop();
        let url: string = "";
        getDownloadURL(ref(FIREBASE_STORAGE, `ProfileImages/${email}.${fileExtenstion}`))
            .then((URL) => {

                updateProfile(user!, {
                    photoURL: URL
                })

            })
            .catch((error) => {
                console.log(error);
            });
    }

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


    const handleImageClick = () => {
        setShowModal(!showModal);
    }

    const handleModalCancel = () => {
        setShowModal(false);
    }

    const handleAccountView = () => {
        setOption('account');
    }

    const handleProfileView = () => {
        setOption('profile');
    }

    const handleSettingView = () => {
        setOption('setting');
    }

    

    

    useEffect(() => {

        if (trigger2) uploadImageFirebaseStorage();
        setTrigger2(false);
    }, [trigger2])

    useEffect(() => {
        if (trigger) {
            getImageUrl();
        }
    }, [trigger])

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
                if (currUser1.photoURL) {
                    setProfileImageUrl(currUser1.photoURL);
                    // console.log(currUser.photoURL);

                }
            }
        })

    }, [])
    return (
        <View style={[tw(""), {
            flex: 1,
            backgroundColor: 'transparent',
            height: Dimensions.get('window').height + 30,
            // position: 'absolute',
            zIndex: 10,
            minWidth: '100%',
            zindex: -21,
            padding: 5,


        }]}
        >
            <ScrollView style={[tw("flex flex-col"), {
                backgroundColor: 'transparent',
                height: 'auto',
                paddingBottom: 40,
            }]}>
                <Pressable style={{
                    height: 160,
                    width: 160,
                    borderRadius: 80,
                    // position: 'absolute',
                    marginTop: 4,
                    marginLeft: Dimensions.get('window').width * 0.50 - 80,
                    borderWidth: 3,
                    borderColor: MD2Colors.blue800,
                    borderEndColor: MD2Colors.green400,
                    borderEndWidth: 2,

                }}
                    onPress={handleImageClick}
                >

                    <Image
                        source={profileImageUrl}
                        placeholder={BLURHASH}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 80,
                        }}

                    />
                    <ImagePlus size={20} color={'white'} style={[tw("absolute"), {
                        bottom: 4,
                        left: 120,
                    }]} />
                </Pressable>
                <View style={[tw("mt-10 flex flex-row justify-around"), {

                }]}>
                    <Pressable style={[tw("items-center justify-center"), {
                        height: 50,
                        width: width * 0.2,

                    }]}
                        onPress={handleAccountView}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: option === 'account' ? MD2Colors.green800 : 'white',
                            }}
                        >Account
                        </Text>
                        {option === 'account'
                            ?
                            <View style={{
                                height: '6%',
                                width: '60%',
                                backgroundColor: MD2Colors.green800,
                                borderRadius: 100,

                            }} />
                            :
                            null
                        }
                    </Pressable>
                    <Pressable style={[tw("items-center justify-center"), {
                        height: 50,
                        width: width * 0.2,

                    }]}
                        onPress={handleProfileView}

                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: option === 'profile' ? MD2Colors.green800 : 'white',
                            }}
                        >Profile
                        </Text>
                        {option === 'profile'
                            ?
                            <View style={{
                                height: '6%',
                                width: '45%',
                                backgroundColor: MD2Colors.green800,
                                borderRadius: 100,
                            }}
                            /> : null}
                    </Pressable>
                    <Pressable style={[tw("items-center justify-center"), {
                        height: 50,
                        width: width * 0.2,

                    }]}
                        onPress={handleSettingView}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: option === 'setting' ? MD2Colors.green800 : 'white',
                            }}
                        >Setting
                        </Text>
                        {option === 'setting'
                            ?
                            <View style={{
                                height: '6%',
                                width: '50%',
                                backgroundColor:
                                    MD2Colors.green800,
                                borderRadius: 100,
                            }}
                            />
                            :
                            null
                        }
                    </Pressable>

                </View>
                <View style={tw("mt-8")} />
                {currUser && option === 'account'
                    ?
                    (
                        <AccountViewAccount
                            currUser={ currUser}
                        />
                    )
                    : currUser && option === 'profile'
                        ?
                        (
                            <ProfileViewAccount 
                                currUser={currUser}
                            />
                        )
                        : currUser && option === 'setting'
                        ?
                        (
                            <SettingViewAccount />
                        )
                        :
                        (
                            null
                        )
                }


                <View style={{ height: 150 }}>

                </View>
            </ScrollView>
            <PaperProvider>
                <Portal>
                    <Modal
                        visible={showModal}
                        // dismissable={true}
                        onDismiss={handleModalCancel}
                        contentContainerStyle={[tw(""), {
                            // backgroundColor: 'white',
                            // padding: 20,
                            position: 'absolute',
                            bottom: 0,
                            width: width - 8,
                            height: 220,
                            borderWidth: 1,
                            zIndex: 12,

                        }]}
                        style={[tw(""), {}]}
                    >
                        <Animated.View style={[tw("flex flex-row justify-around"), {
                            height: '100%',
                            width: '100%',
                            // backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            borderRadius: 20,
                            zIndex: 12,
                            backgroundColor: 'black',
                        }]}
                            entering={SlideInDown}
                            exiting={SlideOutDown}
                        >
                            <Pressable style={[tw("flex flex-col items-center justify-center"), {
                                width: '50%',
                                backgroundColor: 'transparent',
                            }]}
                                onPress={handleCamera}
                            >
                                <Camera color={'white'} />
                                <Text style={{ fontSize: 20, fontWeight: 'bold', }}>
                                    Take Photo
                                </Text>
                            </Pressable>
                            <Pressable style={[tw("flex flex-col items-center justify-center"), {
                                width: '50%',
                                backgroundColor: 'transparent',

                            }]}
                                onPress={handleStorage}
                            >
                                <ImageIcon color={'white'} />
                                <Text style={{ fontSize: 20, fontWeight: 'bold', }}>
                                    Upload from Gallery
                                </Text>
                            </Pressable>
                        </Animated.View>
                    </Modal>
                </Portal>
            </PaperProvider>
        </View>
    )
}

export default ProfileEditScreen