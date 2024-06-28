import CustomButton from '@/components/CustomButton';
import { CustomTextInput } from '@/components/CustomTextInput';
import { Text } from '@/components/Themed';
import { useEmail } from '@/contexts/EmailContext';
import { usePass } from '@/contexts/PasswordContext';
import { DB, FIREBASE_AUTH } from '@/firebase/FirebaseConfig';
import { RegisterPageType } from '@/types/RegisterPageType';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { View } from 'react-native';
import { useTailwind } from 'tailwind-rn';

// Create Accounf Button Laoding, 

const actionCodeSettings = {
    url: 'https://newsbiref.firebaseapp.com',
    handleCodeInApp: true,
    dynamicLinkDomain: 'newsbrief.page.link'
};

const CreateAccount = ({
    screen,
    setScreen
}: RegisterPageType) => {

    const tw = useTailwind(); 
    const {
        email,
        setEmail
    } = useEmail();
    const {
        pass,
        setPass
    } = usePass(); 

    const [cPass, setCPass] = useState<string>(''); 
    const [emailExists, setEmailExists] = useState(false)
    const [errorEmail, setErrorEmail] = useState<boolean | null>(null);
    const [userName, setUserName] = useState<string>(''); 
    const [errorUserName, setErrorUserName] = useState<boolean | null>(null); 
    const [userNameMessage, setUserNameMessage] = useState<string>('')
    const [currentNames, setCurrentNames] = useState<Set<string>>(new Set<string>())
    const [passStatus, setPassStatus] = useState<boolean | null>(null);
    const [passMessage, setPassMessage] = useState<string>('');

    const checkEmail = () => {
        if (email?.includes('.') && email?.includes('@')) { 
            setErrorEmail(false); 
        } else if (email?.length !== 0 && (!email?.includes('.') || !email?.includes('@'))){
            setErrorEmail(true); 
        } else {
            setErrorEmail(null);
        }
        if (email === null) setErrorEmail(email);
    }

    
    const checkIfEmailExists = async () => {
        if (email?.length && email.includes('@') && email.includes('.')) {
            try {

                const docRef = doc(DB, "User", email.toLowerCase());
                const docSnap = await getDoc(docRef);
                console.log(email);
                if (docSnap.exists()) {
                    setEmailExists(true);
                } else setEmailExists(false);

            } catch (error) {
                console.error(error);

            }
        }
        if (email === '') {
            setEmailExists(false);
        }
        

    } 

    const getUserNames = async () => {
        if (userName.length > 3) {
            const colRef = collection(DB, 'User');
            try {
                const docs = await getDocs(colRef);
                docs.forEach((doc) => {
                    setCurrentNames((prevSet) => new Set(prevSet).add(doc.data().userName))
                })

            } catch (error) {
                console.error(error);
            }

        }
    }

    const checkUserName = async () => {
        if (userName.length <= 3) {
            setErrorUserName(true)
            setUserNameMessage("Username must contain at least 4 letters");
        }
        if (userName.length > 3) { 
            if (currentNames.has(userName)) {
                setErrorUserName(true); 
                setUserNameMessage("Username already exists");

            } else {
                setErrorUserName(false);
                setUserNameMessage("Username is valid");
            }
        }
        if (userName === '') {
            setErrorUserName(null);
        }
    }

    const comparePasswords = () => {
        if (pass === cPass && pass.length > 5) { 
            setPassStatus(true); 
            setPassMessage("Correct");
        }
        if (pass !== cPass && pass.length > 5) {
            setPassStatus(true);
            setPassMessage("Password did not match");
        }
        if (pass.length < 5 && pass.length >= 1) {
            setPassStatus(false); 
            setPassMessage("Password must contain at least 6 letters");
        }
        if (pass.length === 0) { 
            setPassStatus(null); 
        }
    }

    

    const signUp = async () => { 
        try {
            
            const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email!, pass);
            const result = await sendEmailVerification(response.user, actionCodeSettings);
            if (email) {
                const docRef = await setDoc(doc(DB, 'User', email.toLowerCase()), {
                    userName: userName,
                    dateJoined: new Date(),
                })
            }
        } catch (error) {
            alert("CreateAccount" + error);
        } finally {
            
        }
    }

    const handleClick = () => {
        // setScreen(!screen) 
        if (errorEmail === false && emailExists === false &&
            errorUserName === false && passStatus === true && 
            email !== null
        ) { 
            signUp(); 
            setScreen(!screen) 
        }
    }

    useEffect(() => {
        checkEmail();
        checkIfEmailExists();
    }, [email]);

    useEffect(() => {
        getUserNames();
    }, []); 

    useEffect(() => {
        checkUserName();
    }, [userName]); 

    useEffect(() => {
        comparePasswords();
    }, [cPass, pass]);

  return (
      <View style={[tw("flex flex-col"), { gap: 10, overflow: 'scroll'}]}>

        
          <CustomTextInput
              label={"Email"}
              content={email!}
              setContent={setEmail}
              error={errorEmail}
              onChange={() => {
                  setEmail(email);
              }}

          />
          {emailExists ? (
              <Text style={[tw("text-red-500 font-bold mr-12"), { fontSize: 12, paddingLeft: 18, }]}>
                duplicate email    
              </Text>
          ) : (
                  <Text style={[tw("text-red-500 font-bold"), { fontSize: 12, paddingLeft: 18,}]}>
                      
                  </Text>
          )}
          
          <CustomTextInput
              label={"Username"}
              content={userName}
              setContent={setUserName}
              error={errorUserName}
              onChange={() => {
                  setUserName(userName);
              }}

          />
          {errorUserName === true ? (
              <Text style={[tw("text-red-500 font-bold mr-12"), { fontSize: 12, paddingLeft: 18, }]}>
                  {userNameMessage}
              </Text>
          ) : errorUserName === false ? (
              <Text style={[tw("text-green-500 font-bold"), { fontSize: 12, paddingLeft: 18, }]}>
                      {userNameMessage}
              </Text>
          ) : (
                  <Text style={[tw("text-green-500 font-bold"), { fontSize: 12, paddingLeft: 18, }]}>

                  </Text>
          )}
          
          <CustomTextInput
              label={"Password"}
              content={pass}
              setContent={setPass}
              hidden={true}
              onChange={() => {
                  setPass(pass)
              }}
          />
          {passStatus === false ? (
              <Text style={[tw("text-red-500 font-bold mr-12"), { fontSize: 12, paddingLeft: 18, }]}>
                  {passMessage}
              </Text>
          ): (
                  <Text style={[tw("text-green-500 font-bold"), { fontSize: 12, paddingLeft: 18, }]}>

                  </Text>
            )}
          <CustomTextInput
              label={"Confirm Password"}
              content={cPass}
              setContent={setCPass}
              hidden={true}
              onChange={() => {
                  setCPass(cPass)
              }}
          />

          {passStatus === true && cPass.length > 0? (
              <Text style={[tw("text-green-500 font-bold mr-12"), { fontSize: 12, paddingLeft: 18, color: pass !== cPass ? 'red' : 'green'}]}>
                  {passMessage}
              </Text>
          ) : (
              <Text style={[tw("text-green-500 font-bold"), { fontSize: 12, paddingLeft: 18, }]}>

              </Text>
          )}

          <View style={tw("w-11/12 pt-2")}>
              <CustomButton
                  buttonLabel="Create Account"
                  handleClick={handleClick}
              />
          </View>
      </View>
  )
}

export default CreateAccount