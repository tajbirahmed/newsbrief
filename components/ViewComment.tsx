import React, { useEffect, useState } from 'react'
import { Text, View } from '@/components/Themed'
import { useTailwind } from 'tailwind-rn'
import { useLocalSearchParams } from 'expo-router';
import { Timestamp, collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { DB } from '@/firebase/FirebaseConfig';
import { Dimensions, Pressable, TextInput } from 'react-native';
import { MD2Colors } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { BLURHASH } from '@/constants/BLURHASH';

interface CommentType {
	article_id: string, 
	comment: string, 
	userName: string,
	dateCreated: Timestamp,
	imageUrl: string,
}

const ViewComment = () => {

	const tw = useTailwind();
	const {
		article_id
	} = useLocalSearchParams<{
		article_id: string
	}>();
	
	const WIDTH = Dimensions.get('window').width;
	const HEIGHT = Dimensions.get('window').height;

	const [comments, setComments] = useState<CommentType[]>([]);
	const [commentsLoading, setCommentsLoading] = useState<boolean>(false);

	const handleCommentLongPress = () => { 
		console.log("Comment long press detected.");
		
	}

	useEffect(() => {
	  const q = query(collection(DB, "Comment"),
	    where("article_id", "==", article_id),
	    orderBy("dateCreated", "desc"), 
	    limit(5)
	  );

	  const unsubscribe = onSnapshot(q, (querySnapshot) => {
	    querySnapshot.docChanges().forEach((change) => { 
	      if (change.type === "added") {
	        setComments((prev) => [change.doc.data() as CommentType, ...prev]);
	      } else if (change.type === "modified") {
	        console.log("Modified city: ", change.doc.data());
	      } else if (change.type === "removed") {
	        console.log("Removed city: ", change.doc.data());
	      }
	    })
	  });

	  return () => unsubscribe();
	}, []);


	return (
		<View style={[tw("flex flex-col pt-10")]}>
			{commentsLoading
				?
				<>
				</>
				: comments.length > 0
					?
					(
						comments.map((val, index) => {
							return (
								<View style={[tw("flex flex-row py-4"), {
								}]}
								key={index}
								>
									<View style={{
										height: 50,
										width: 50,
										borderRadius: 25,
									}}>
										<Image
											placeholder={BLURHASH}
											source={{
												uri: val.imageUrl
											}}
											style={{
												width: WIDTH * 0.1,
												height: WIDTH * 0.1,
												borderRadius: WIDTH * 0.05,
											}}
										/>
									</View>
									<Pressable style={{
										width: WIDTH * 0.7,
										height: 'auto',
										backgroundColor: MD2Colors.blueGrey900,
									}}
										onLongPress={handleCommentLongPress}
									>
										<TextInput style={[tw("text-white p-2"), {
											fontFamily: 'monospace'
										}]}
											placeholder="Write a comment"
											readOnly={true}
										>
											{val.comment}
										</TextInput>

									</Pressable>
								</View>
							)
						})
					)
					:
					<></>
				
			}
		</View>
	)
}

export default ViewComment