import CustomButton from '@/components/CustomButton'
import { Text, View } from '@/components/Themed'
import { BLURHASH } from '@/constants/BLURHASH'
import { useProfileImage } from '@/contexts/ProfileImageUrlContext'
import { DB, FIREBASE_AUTH, FIREBASE_STORAGE } from '@/firebase/FirebaseConfig'
import { Image } from 'expo-image'
import { User, onAuthStateChanged, updatePassword, updateProfile } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Dimensions, NativeEventEmitter, ScrollView } from 'react-native'
import { MD2Colors, MD3Colors } from 'react-native-paper'
import { useTailwind } from 'tailwind-rn'
import * as ImagePicker from 'expo-image-picker';
import { useEmail } from '@/contexts/EmailContext'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { CustomTextInput } from '@/components/CustomTextInput'
import { collection, doc, getDoc, query, where } from 'firebase/firestore'
import { FolderPen, ImagePlus, KeyRound, Lock, Mail, MailCheck, MailX } from 'lucide-react-native'
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
    const [userName, setUserName] = useState(''); 
    const [pass, setPass] = useState(''); 
    const [cPass, setCPass] = useState('');

    const HEIGHT = Dimensions.get('window').height

    const tw = useTailwind();

    const handleStorage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 0.3,
        });
        if (!result.canceled){
            setProfileImageUrl(result.assets[0].uri)
            setTrigger2(true);
        }
    }

    const handleCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            // mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            cameraType: ImagePicker.CameraType.front,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.3,
        });
        if (!result.canceled){
            setProfileImageUrl(result.assets[0].uri);
            setTrigger2(true);
        }
        else if (result.canceled) {
            alert('Capture an image to set as profile picture.')
        }
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
                
                setUserName(docSnap.data().userName);
            } else {
                console.log("No such user!");
            }
        } catch (error) {
            throw new Error("[ProfileEditScreen.tsx]" + error)
        }
            
    }

    const handlePassChange = async () => { 
        try {
            console.log("success");
            if (pass === cPass && pass.length >= 5) {
                await updatePassword(user!, cPass)
            }
        } catch (error) {
            console.log(error);
            
        }
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
        onAuthStateChanged(FIREBASE_AUTH, async (currUser) => {
            if (currUser) {
                setUser(currUser);
                setEmail(currUser.email);
                setDisplayName(currUser.displayName!);
                if (currUser.photoURL) {
                    setProfileImageUrl(currUser.photoURL);
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
                <View style={{
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

                }}>
                    {/* <Text style={{color :'white', }}>Asdasd</Text> */}
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
                <View style={[tw("flex flex-row items-center"), { paddingLeft: 10, }]}>
                    <ImagePlus size={20} color={'white'}/>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10, }}>
                        Edit Photo
                    </Text>
                </View>
                <View style={[tw("flex flex-row justify-around")]}>
                    <View style={[{
                        width: '30%',
                        // height: '10%',
                        overflow: 'hidden',

                    }]}>
                        <CustomButton
                            buttonLabel={'Camera'}
                            handleClick={handleCamera}
                        />
                    </View>
                    <View style={[{
                        width: '30%',
                        overflow: 'hidden',
                    }]}>
                        <CustomButton
                            buttonLabel={'Upload'}
                            handleClick={handleStorage}
                        />
                    </View>
                </View>
                <View style={[tw("flex flex-row items-center"), { paddingLeft: 10, }]}>
                    <FolderPen size={20} color={'white'} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10, }}>
                        Display Name
                    </Text>
                </View>
                <View>
                    <CustomTextInput
                        label={'Display Name'}
                        content={displayName}
                        setContent={setDisplayName}
                        onChange={() => { 
                            setDisplayName(displayName)
                        }}
                        onEndEditing={handleDisplayName}
                    />
                </View>
                <View style={[tw("flex flex-row items-center"), { paddingLeft: 10, marginTop: 15}]}>
                    <Lock size={20} color={'white'} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10, }}>
                        User Name
                    </Text>
                </View>
                <View>
                    <CustomTextInput
                        label={'User Name'}
                        content={userName}
                        setContent={() => { }}
                        readonly={true}
                    />
                </View>
                <View style={[tw("flex flex-row items-center"), { paddingLeft: 10, marginTop: 15 }]}>
                    <MailCheck size={20} color={'white'} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10, }}>
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
                    <KeyRound size={20} color={'white'} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10, }}>
                        Password
                    </Text>
                </View>
                <View>
                    <CustomTextInput
                        label={'Password'}
                        content={pass}
                        setContent={setPass}
                        onChange={() => { 
                            setPass(pass);
                            if (pass.length < 5) {
                                setCPass('');
                            }
                        }}
                        hidden={true}
                    />
                </View>
                {pass.length >= 5
                    ?
                    (
                        <>
                            <View style={[tw("flex flex-row items-center"), { paddingLeft: 10, marginTop: 15 }]}>
                                <KeyRound size={20} color={'white'} />
                                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10, }}>
                                    Confirm Password
                                </Text>
                            </View>
                            <View>
                                <CustomTextInput
                                    label={'Confirm Password'}
                                    content={cPass}
                                    setContent={setCPass}
                                    onChange={() => {
                                        setCPass(cPass);
                                    }}
                                    hidden={true}
                                />
                            </View>
                        </>
                    )
                    : pass.length > 0 && pass.length < 5
                        ?
                        (
                            <View style={{paddingLeft: 20, marginVertical: 5}}>
                                <Text style={{ color: MD3Colors.error50, fontWeight: 'semibold' }}>
                                    Password lenth must be at least 5!
                                </Text>
                            </View>
                        )
                        :
                        (
                            <></>
                        )
                }

                {pass === cPass && pass.length >= 5
                    ?
                        (
                        <CustomButton
                            buttonLabel={'Change Password'}
                            handleClick={handlePassChange}
                        />
                        )
                    :
                        (
                            <></>
                        )
                }

                <View style={{height: 150}}>

                </View>
            </ScrollView>

        </View>
    )
}

export default ProfileEditScreen