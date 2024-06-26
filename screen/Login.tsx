import CustomButton from '@/components/CustomButton';
import { CustomTextInput } from '@/components/CustomTextInput';
import { useAuth } from '@/contexts/AuthContext';
import { useEmail } from '@/contexts/EmailContext';
import { usePass } from '@/contexts/PasswordContext';
import { DB, FIREBASE_AUTH } from '@/firebase/FirebaseConfig';
import { RegisterPageType } from '@/types/RegisterPageType';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {  doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { View } from 'react-native';
import { useTailwind } from 'tailwind-rn';



const Login = ({ 
    screen, 
    setScreen
} : RegisterPageType) => {
  
    const {
        user,
        setUser
    } = useAuth();
    const {
        email,
        setEmail
    } = useEmail();
    const tw = useTailwind();
    const {
        pass,
        setPass
    } = usePass(); 
    const [error, setError] = useState<boolean | null>(null); 
    
    const signIn = async () => {
        try {
            const response =
                await signInWithEmailAndPassword(
                    FIREBASE_AUTH,
                    email!,
                    pass
                );

            if (!response.user.emailVerified) {
                alert('Verify Email!');
                signOut(FIREBASE_AUTH);
            }

            if (response.user.emailVerified) {
                alert('Success');
                setUser(response.user);
            }
            console.log("Success");
            

        } catch (error: any) {
            console.error(error);
            alert('Check your emails');
        }
    }

    const handleClick = () => {
        if (error === false ) signIn(); 
        else setScreen(!screen)
    }
    
    const checkIfEmailExists = async () => {
        if (email?.length && email.includes('@') && email.includes('.')) { 
            try {

                const docRef = doc(DB, "User", email.toLowerCase());
                const docSnap = await getDoc(docRef); 
                console.log(email);
                if (docSnap.exists()) {
                    setError(false);
                    
                } else setError(true);

            } catch (error) {
                console.error(error);
                
            }
        }
        else if (email) {
            setError(true);
        }
            
    } 

    useEffect(() => {
        checkIfEmailExists();
        if (error) {
            if (email?.length == 0) {
                setError(null)
            }
        }
    }, [email])

    return (
        <View style={[tw("flex flex-col h-2/3"), { gap: 10 }]}>
            
            
            <CustomTextInput
                label={"Email"}
                content={email!}
                setContent={setEmail}
                error={error}
                onChange={() => {
                    setEmail(email);
                }}
                
            />
            
            <CustomTextInput
                label={"Password"}
                content={pass}
                setContent={setPass}
                hidden={true}
            />
                
            
            <View style={tw("w-11/12 pt-2")}>
                <CustomButton
                    buttonLabel={error === false ? "Login" : "Create Account"}
                    link={"/home"}
                    handleClick={handleClick}
                />
            </View>
        </View>
  )
}

export default Login