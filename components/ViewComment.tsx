import React, { useEffect, useRef, useState } from 'react'
import { Text, View } from '@/components/Themed'
import { useTailwind } from 'tailwind-rn'
import { useLocalSearchParams } from 'expo-router';
import { Timestamp, collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { DB } from '@/firebase/FirebaseConfig';
import { Dimensions, Pressable, TextInput } from 'react-native';
import { ActivityIndicator, Button, MD2Colors, MD3Colors, Modal } from 'react-native-paper';
import { Image } from 'expo-image';
import { BLURHASH } from '@/constants/BLURHASH';
import { useProfileImage } from '@/contexts/ProfileImageUrlContext';
import { DarkTheme } from '@react-navigation/native';
import { Delete, DeleteIcon, Edit, Trash2 } from 'lucide-react-native';

interface CommentType {
	comment_id: string,
	article_id: string,
	comment: string,
	userName: string,
	dateCreated: Timestamp,
	imageUrl: string,
	lastModified: Timestamp,
}

const ViewComment = () => {

	const tw = useTailwind();
	const {
		article_id
	} = useLocalSearchParams<{
		article_id: string
	}>();
	const {
		profileImageUrl,
		setProfileImageUrl
	} = useProfileImage();
	const WIDTH = Dimensions.get('window').width;
	const HEIGHT = Dimensions.get('window').height;

	const [comments, setComments] = useState<CommentType[]>([]);
	const [commentsLoading, setCommentsLoading] = useState<boolean>(true);
	const initialLoad = useRef(true);
	const [longPress, setLongPress] = useState<boolean>(false);
	const [comment, setComment] = useState<CommentType | undefined>(undefined);
	const [updateComment, setUpdateComment] = useState<string>("");
	const [uploading, setUploading] = useState<boolean>(false);
	const [editComment, setEditComment] = useState<boolean>(false);
	const [noComment, setNoComments] = useState<number>(5);
	


	const handleDelete = async () => {
		if (comment) {
			setUploading(true);
			const commentsQuery = query(
				collection(DB, "Comment"),
				where("comment_id", "==", comment.comment_id)
			);
			try {
				const querySnapshot = await getDocs(commentsQuery)
				querySnapshot.forEach(async (document) => {
					await deleteDoc(
						doc(DB, "Comment", document.id)
					)
				})
			} catch (error) {
				console.error("[View Comment.tsx] Error deleting comment: ", error);
			} finally {
				setUploading(false);
				setLongPress(false);
			}
		}
	}
	const handleEdit = () => {
		setEditComment(true);
		setLongPress(false);
		// console.log(updateComment);


	}

	const handleCommentLongPress = (comment: CommentType) => {
		if (comment.imageUrl === profileImageUrl) {
			setComment(comment);
			setUpdateComment(comment.comment);
			setLongPress(true);
		}
	}
	const handleModalDismiss = () => {
		setLongPress(false);
	}

	const handleEditSave = async () => {
		if (comment &&
			updateComment !== comment.comment &&
			updateComment.length !== 0
		) {
			setUploading(true);
			const commentsQuery = query(
				collection(DB, "Comment"),
				where("comment_id", "==", comment.comment_id)
			);
			try {
				const querySnapshot = await getDocs(commentsQuery);
				querySnapshot.forEach(async (document) => {
					await updateDoc(
						doc(DB, "Comment", document.id), {
						comment: updateComment,
						lastModified: new Date(),
					});
				});
				setComment(undefined);
				setUpdateComment("");
			} catch (error) {
				console.error("[View Comment.tsx] Error updating comment: ", error);
			} finally {
				setUploading(false);
			}
		}
		if (comment && updateComment.length === 0) {
			handleDelete();
		}
	}

	const handleEditCancel = () => {
		setComment(undefined);
		setUpdateComment("");
		setEditComment(false)

	}

	const handleLoadMore = () => { 
		setNoComments((prev) => prev + 5)
	}

	const handleLoadLess = () => { 
		setNoComments((prev) => Math.max(prev - 5, 5)); 
	}

	useEffect(() => {
		const q = query(
			collection(DB, "Comment"),
			where("article_id", "==", article_id),
			orderBy("dateCreated", "desc"),
			limit(noComment)
		);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			if (initialLoad.current) {
				setCommentsLoading(true);
				const initialComments: CommentType[] = [];
				querySnapshot.forEach((doc) => {
					initialComments.push(doc.data() as CommentType);
				});
				setComments(initialComments);
				initialLoad.current = false;
				setCommentsLoading(false);
			} else {
				querySnapshot.docChanges().forEach((change) => {
					if (change.type === "added") {
						setComments((prev) => [change.doc.data() as CommentType, ...prev]);
					} else if (change.type === "modified") {
						setComments((prev) =>
							prev.map((comment) =>
								comment.comment_id === change.doc.data().comment_id ? change.doc.data() as CommentType : comment
							)
						);
					} else if (change.type === "removed") {
						setComments((prev) =>
							prev.filter((comment) => comment.comment_id !== change.doc.data().comment_id)
						);
						console.log("Comment removed: ", change.doc.id);

					}
				});
			}
		});

		return () => {
			unsubscribe();
			initialLoad.current = true;
		};
	}, [noComment]);


	return (
		<View style={[tw("flex flex-col pt-10")]}>
			{commentsLoading
				?
				(
					<View style={[tw(""), {
						marginTop: 50,
						width: WIDTH,
						backgroundColor: 'transparent',
					}]}>
						<ActivityIndicator size="small" color={MD2Colors.blue500} />
						<Text style={{
							fontWeight: 'semibold',
							fontSize: 12,
							alignSelf: 'center',
							color: MD2Colors.blue500,
							marginTop: 5,
						}}>
							Loading Comments...
						</Text>
					</View>
				)
				: comments.length > 0
					?
					(
						comments.map((val, index) => {
							return (
								<View style={[tw("flex flex-col py-4")]}>
									<View style={[tw("flex py-4"), {
										flexDirection: profileImageUrl !== val.imageUrl ? 'row' : 'row-reverse',
										justifyContent: 'space-around',
									}]}
										key={index}
									>

										<View style={{
											height: 50,
											width: 50,
											borderRadius: 25,
											alignSelf: 'center',
											paddingTop: 5,
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
													borderWidth: 2,
													borderColor: MD2Colors.blue500,
												}}
											/>
										</View>

										<Pressable style={{
											width: WIDTH * 0.7,
											height: 'auto',
											backgroundColor: MD2Colors.blueGrey900,
											borderRadius: 10,
										}}
											onLongPress={() => handleCommentLongPress(val)}
										>
											{comment?.comment_id === val.comment_id && editComment
												?
												(
													<TextInput style={[tw("text-white p-2 px-3"), {
														minHeight: 60,
														fontFamily: 'monospace',

													}]}
														multiline={true}
														value={updateComment}
														onChangeText={(text) => {
															setUpdateComment(text)
															// console.log("comment" + text);

														}}
														autoFocus={true}
													/>
												)
												:
												(
													<TextInput style={[tw("text-white p-2 px-3"), {
														minHeight: 60,
														fontFamily: 'monospace',

													}]}
														readOnly={true}
														multiline={true}
														value={val.comment}
													/>
												)
											}


										</Pressable>


									</View>
									{val.comment_id === comment?.comment_id && editComment
										?
										(
											<View key={index} style={[tw("flex flex-row self-end"), {
												marginRight: 50 + WIDTH * 0.1,
											}]}>
												<Pressable
													style={{
														// alignSelf: 'flex-end',
														// marginRight: 50 + WIDTH * 0.1,
														backgroundColor: MD3Colors.error50,
														width: WIDTH * 0.14,
														height: HEIGHT * 0.04,
														justifyContent: 'center',
														alignItems: 'center',
														borderRadius: 8,
														marginHorizontal: 5
													}}
													onPress={handleEditCancel}
												>
													<Text style={{
														fontSize: 14,
														fontWeight: 'bold'
													}}>
														Decline
													</Text>
												</Pressable>
												<Button
													style={{
														// alignSelf: 'flex-end',
														// 
														backgroundColor: MD2Colors.green800,
														width: WIDTH * 0.12,
														height: HEIGHT * 0.04,
														justifyContent: 'center',
														alignItems: 'center',
														borderRadius: 8,
														marginHorizontal: 5

													}}
													onPress={handleEditSave}
													loading={uploading}

												>
													<Text style={{
														fontSize: 14,
														fontWeight: 'bold'

													}}>
														Save
													</Text>
												</Button>
											</View>
										)
										:
										<View style={{
											alignSelf: 'flex-end',
											marginRight: 50 + WIDTH * 0.1,
											backgroundColor: MD2Colors.green800,
										}}>
										</View>

									}
									
								</View>
							)
						})
					)
					:
					null
			}
			{comments.length > 0
				? 
				<View style={[tw("flex flex-row justify-around")]}>
					{comments.length > 5
						?
						(
							<Button
								onPress={handleLoadLess}
								style={[tw("flex flex-row justify-around"), {
									width: WIDTH * 0.25,
									backgroundColor: MD3Colors.error50,
									height: HEIGHT * 0.045,
									borderRadius: 10,
								}]}
							>
								<Text style={[{
									fontWeight: 'bold',
								}]}>
									Load Less
								</Text>
							</Button>
						)
						:
						null
					 }
					<Button
						onPress={handleLoadMore}
						style={[tw("flex flex-row justify-around"), {
							width: WIDTH * 0.25,
							backgroundColor: MD2Colors.blue800,
							height: HEIGHT * 0.045,
							borderRadius: 10,
						}]}
					>
						<Text style={[{
							fontWeight: 'bold', 
						}]}>
							Load More
						</Text>
					</Button>
					
				</View>	
				:
				null
			}
			<Modal
				theme={DarkTheme}
				visible={longPress}
				onDismiss={handleModalDismiss}
				style={{
					// backgroundColor: 'yellow',
					alignItems: 'center',
					marginTop: 300,
					paddingHorizontal: 50,

				}}
			>
				<View style={{
					width: WIDTH,
					height: 80,
					alignItems: 'center',
					justifyContent: 'space-around',
					backgroundColor: 'transparent',
					flexDirection: 'row',
				}}>
					<Button
						onPress={handleDelete}
						style={[tw("flex flex-row justify-around items-center"), {
							width: WIDTH * 0.25,
							backgroundColor: MD3Colors.error50,
							height: HEIGHT * 0.045,
							borderRadius: 10,

						}]}
						loading={uploading}
					>
						<Text style={[tw("pl-1"), {
							fontWeight: 'bold'
						}]}>
							Delete
						</Text>
						<Trash2 size={18} color={'white'} style={{
							marginLeft: 5
						}} />
					</Button>
					<Pressable
						onPress={handleEdit}
						style={[tw("flex flex-row justify-around items-center"), {
							width: WIDTH * 0.16,
							backgroundColor: MD2Colors.green800,
							height: HEIGHT * 0.045,
							borderRadius: 10,
						}]}
					>
						<Text style={[tw("pl-1"), {
							fontWeight: 'bold'
						}]}>Edit</Text>
						<Edit size={18} color={'white'} />
					</Pressable>
				</View>
			</Modal>

		</View>
	)
}

export default ViewComment