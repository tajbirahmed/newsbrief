import CustomButton from '@/components/CustomButton'
import { Text, View } from '@/components/Themed'
import { BLURHASH } from '@/constants/BLURHASH'
import { useProfileImage } from '@/contexts/ProfileImageUrlContext'
import { FIREBASE_AUTH } from '@/firebase/FirebaseConfig'
import { Image } from 'expo-image'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { MD2Colors } from 'react-native-paper'
import { useTailwind } from 'tailwind-rn'

const ProfileEditScreen = () => {

    const {
        profileImageUrl,
        setProfileImageUrl
    } = useProfileImage();
    const HEIGHT = Dimensions.get('window').height
    const tw = useTailwind();
    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                if (user.photoURL) {
                    setProfileImageUrl(user.photoURL);
                    console.log(user.photoURL);

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
            zindex: -21


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
                <View style={[tw("flex flex-row justify-around")]}>
                    <View style={[{
                        width: '30%', 
                        overflow: 'hidden',
                         
                    }]}>
                        <CustomButton 
                            buttonLabel={'Camera'}
                        />
                    </View>
                    <View style={[{
                        width: '30%',
                        overflow: 'hidden',
                    }]}>
                        <CustomButton
                            buttonLabel={'Upload'}
                        />
                    </View>
                </View>
            </ScrollView>

        </View>
    )
}

export default ProfileEditScreen