import React, { useEffect, useState } from 'react'
import { Text, View } from '@/components/Themed'
import { useTailwind } from 'tailwind-rn'
import { CustomTextInput } from './CustomTextInput';
import { Dimensions } from 'react-native';
import CustomButton from './CustomButton';
import { addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { DB, FIREBASE_AUTH } from '@/firebase/FirebaseConfig';
import { useLocalSearchParams } from 'expo-router';
import { useEmail } from '@/contexts/EmailContext';
import { onAuthStateChanged } from 'firebase/auth';
import { useProfileImage } from '@/contexts/ProfileImageUrlContext';
import { useUserName } from '@/contexts/UserNameContext';


const PostComment = () => {
    const tw = useTailwind(); 

    const {
        email,
        setEmail
    } = useEmail(); 
    const { 
        profileImageUrl, 
        setProfileImageUrl
    } = useProfileImage();

    const {
        article_id
    } = useLocalSearchParams<{
        article_id: string
    }>(); 
    const {
        userName,
        setUserName
    } = useUserName(); 

    const [comment, setComment] = useState('');
    const [postLoading, setPostLoading] = useState<boolean>(false);
    const WIDTH = Dimensions.get('window').width;
    const HEIGHT = Dimensions.get('window').height; 
    const handleCommentPost = async () => { 
        if (userName !== '') {
            setPostLoading(true)
            try {
                await addDoc(collection(DB, 'Comment'), {
                    comment_id: userName + new Date(), 
                    article_id: article_id,
                    comment: comment,
                    dateCreated: new Date(),
                    userName: userName, 
                    imageUrl: profileImageUrl, 
                    lastModified: new Date(), 
                })
                setComment('');
            } catch (error) {
                console.error("Error adding document: ", error);
                alert('Failed to post comment.');
            }
            setPostLoading(false);
        } else {
            console.log("[component/PostComment.tsx] userName is null");
        }
    }
    const getuserName = async () => { 
        if (userName === '') {
            const docRef = doc(DB, 'User', email!);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserName(docSnap.data().userName);
                
            } else {
                console.log("No such document!");
            }
        }
    }
    useEffect(() => { 
        if (email) { 
            getuserName(); 
        }
    }, [email])
    useEffect(() => { 
        if (!email) {
            onAuthStateChanged(FIREBASE_AUTH, (user) => { 
                if (user) {
                    setEmail(user.email); 
                    if (user.photoURL)
                        setProfileImageUrl(user.photoURL);
                }
            })
        } 
        getuserName();
        
        
    }, [])
  return (
      <View style={[tw("flex flex-row items-center mt-10 "), {
          overflow: 'hidden', 
          height: 'auto',
          alignItems: 'center', 
      }]}>
          <View style={{
              width: WIDTH * 0.75, 
              alignSelf: 'center',
              height: 'auto'
          }}>
          <CustomTextInput
              label="Comment"
              content={comment}
              setContent={setComment}
              onChange={() => {
                  setComment(comment)
              }}
              numberOfLines={4}
              readonly={postLoading}
              />
          </View>
          <View style={[tw("self-center pt-4"),{
              width: WIDTH * 0.18,
              overflow: 'hidden'

          }]}> 
              <CustomButton
                  buttonLabel={"Post"}
                  handleClick={handleCommentPost}
                  buttonLoading={postLoading}
              />
          </View>
    </View>
  )
}

export default PostComment