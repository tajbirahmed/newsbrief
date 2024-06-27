import ShareScreen from '@/utils/shareScreen';
import React, { useEffect, useState } from 'react'
import { Pressable } from 'react-native';
import { StyleSheet, useColorScheme } from 'react-native';
import { ThumbsUp, ThumbsDown, Heart, Share2 } from 'lucide-react-native';
import { collection, query, where, onSnapshot, getDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Text, View } from "@/components/Themed"
import { DB, FIREBASE_AUTH } from '@/firebase/FirebaseConfig';
import { useLocalSearchParams } from 'expo-router';
import { useEmail } from '@/contexts/EmailContext';
import { onAuthStateChanged } from 'firebase/auth';



const RatingComp = () => {

    const {
        article_id
    } = useLocalSearchParams<{
        article_id: string
    }>()

    const {
        email,
        setEmail
    } = useEmail();

    const [liked, setLiked] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [dislikeCount, setDislikeCount] = useState(0);
    const [favourite, setFavourite] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);


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

    const getCurrentArticleStatusForCurrentUser = async () => {
        const articleRef = collection(DB, 'UserArticle');
        const q = query(articleRef,
            where('article_id', '==', article_id),
            where('userName', '==', userName)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const articleData = querySnapshot.docs[0].data();
            setLiked(articleData.isLiked);
            setDislike(articleData.isDisliked);
            setFavourite(articleData.isFavorite);
        } else {
            console.log("[component/RatingComponent.tsx] No such article!");
        }
    }

    

    const handleLikeButtonPress = () => { 
        setLiked((prev) => !prev); 
        if (dislike) { 
            setDislike(false); 
        }
    }

    const handleDisLikeButtonPress = () => {
        setDislike((prev) => !prev);
        if (liked) {
            setLiked(false);
        }
    }

    const handleFavouriteButtonPress = () => { 
        setFavourite((prev) => !prev);
    }

    const handleShareButtonPress = async () => { 
        await ShareScreen();
        await toggleShare(); 
    }

    const toggleLike = async () => {
        const articleRef = collection(DB, 'UserArticle');
        const q = query(articleRef,
            where('article_id', '==', article_id),
            where('userName', '==', userName));
        const doc = await getDocs(q);
        doc.forEach((instace) => {
            updateDoc(instace.ref, {
                isLiked: liked
            })
        })
    }

    const toggleDisLike = async () => {
        const articleRef = collection(DB, 'UserArticle');
        const q = query(articleRef,
            where('article_id', '==', article_id),
            where('userName', '==', userName));
        const doc = await getDocs(q);
        doc.forEach((instace) => {
            updateDoc(instace.ref, {
                isDisliked: dislike

            })
        })
    }

    const toggleFav = async () => { 
        const articleRef = collection(DB, 'UserArticle');
        const q = query(articleRef,
            where('article_id', '==', article_id),
            where('userName', '==', userName));
        const doc = await getDocs(q);
        doc.forEach((instace) => {
            updateDoc(instace.ref, {
                isFavorite: favourite
            })
        })
    
    }

    const toggleShare = async () => { 
        const articleRef = collection(DB, 'UserArticle');
        const q = query(articleRef,
            where('article_id', '==', article_id),
            where('userName', '==', userName));
        const doc = await getDocs(q);
        doc.forEach((instace) => {
            updateDoc(instace.ref, {
                isShared: true
            })
        })
    }

    useEffect(() => {
        if (userName) {
            toggleLike();
        }
    }, [liked]);

    
    useEffect(() => { 
        if (userName) { 
            toggleDisLike(); 
        }
    }, [dislike])

    useEffect(() => {
        if (userName) {
            toggleFav();
        }
    }, [favourite]);

    
    useEffect(() => {
        const q = query(collection(DB, "UserArticle"),
            where("article_id", "==", article_id),
            where("isLiked", "==", true)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setLikeCount(querySnapshot.size);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const q = query(collection(DB, "UserArticle"),
            where("article_id", "==", article_id),
            where("isDisliked", "==", true)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setDislikeCount(querySnapshot.size);
        });

        return () => unsubscribe();
    }, []);


    useEffect(() => {
        if (userName) {
            getCurrentArticleStatusForCurrentUser();
        }
    }, [userName]);

    useEffect(() => {
        if (email) {
            getUserName();
        }
    }, [email]);
    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setEmail(user.email);
            }
        })
         
    }, [])


    return (
        <View style={[styles.container, {
            borderColor: 'gray',
        }]}>
            <View style={styles.like_container}>

                {!liked
                    ?
                    (
                        <>
                            <Text style={{
                                fontSize: 12,
                                alignSelf: 'center'
                            }}>
                                {likeCount}
                            </Text>
                            <Pressable
                                onPress={handleLikeButtonPress}>
                                <ThumbsUp size={22} color={'white'} />
                            </Pressable>
                            <Text style={{
                                color: 'white',
                                fontSize: 10,
                                fontWeight: '400',
                            }}>
                                Like
                            </Text>
                        </>
                    )
                    :
                    (
                        <>
                            <Text style={{
                                color: 'white',
                                fontSize: 12,
                                alignSelf: 'center'
                            }}>
                                {likeCount}
                            </Text>
                            <Pressable
                                onPress={handleLikeButtonPress}>
                                <ThumbsUp size={22} color={'white'} strokeWidth={1} fill={'blue'} />
                            </Pressable>
                            <Text style={{ color: 'white', fontSize: 10, fontWeight: '700', }}>
                                Liked
                            </Text>

                        </>
                    )}

            </View>
            <View style={styles.like_container}>

                {!dislike
                    ?
                    (
                        <>
                            <Text style={{
                                color: 'white',
                                fontSize: 12,
                                alignSelf: 'center'
                            }}>
                                {dislikeCount}
                            </Text>
                            <Pressable onPress={handleDisLikeButtonPress}>
                                <ThumbsDown size={22} color={'white'} />
                            </Pressable>
                            <Text style={{
                                color: 'white',
                                fontSize: 10,
                                fontWeight: '400',
                            }}>
                                Dislike
                            </Text>
                        </>
                    )
                    :
                    (
                        <>
                            <Text style={{
                                color: 'white',
                                fontSize: 12,
                                alignSelf: 'center'
                            }}>
                                {dislikeCount}
                            </Text>
                            <Pressable onPress={handleDisLikeButtonPress}>
                                <ThumbsDown size={22} color={'white'} strokeWidth={1} fill={'blue'} />
                            </Pressable>
                            <Text style={{
                                color: 'white',
                                fontSize: 10,
                                fontWeight: '700',
                            }}>
                                Disliked
                            </Text>

                        </>
                    )
                }

            </View>
            <View style={styles.like_container}>
                {!favourite
                    ?
                    (
                        <>
                            <Text style={{
                                fontSize: 8,
                                alignSelf: 'center'
                            }}></Text>
                            <Pressable onPress={handleFavouriteButtonPress}>
                                <Heart size={22} color={'white'} style={{ alignSelf: 'center' }} />
                            </Pressable>
                            <Text style={{
                                color: 'white',
                                fontSize: 10,
                                fontWeight: '400',
                            }}>{"    "}Add to {"\n"} Favourites</Text>
                        </>
                    )
                    :
                    (
                        <>
                            <Text style={{
                                fontSize: 8,
                                alignSelf: 'center'
                            }}>

                            </Text>
                            <Pressable onPress={handleFavouriteButtonPress}>
                                <Heart size={22} color={'white'} strokeWidth={1} fill={'blue'} style={{ alignSelf: 'center' }} />
                            </Pressable>
                            <Text style={{
                                color: 'white',
                                fontSize: 10,
                                fontWeight: '400',
                            }}>{"  "} Added to {"\n"}Favourites</Text>

                        </>
                    )}

            </View>
            <View style={styles.like_container}>
                <Text style={{
                    color: 'white',
                    fontSize: 12,
                    alignSelf: 'center'
                }}>

                </Text>
                <Pressable onPress={handleShareButtonPress}>
                    <Share2 size={22} color={'white'} />
                </Pressable>
                <Text style={{
                    color: 'white',
                    fontSize: 10,
                    fontWeight: '400',
                }}>
                    Share
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        height: 70,
        padding: 5,
        marginTop: 1,
        borderWidth: 0.2,
        width: '95%',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    like_container: {
        width: '25%',
        alignItems: 'center'
    }
})

export default RatingComp;