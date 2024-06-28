import { Text, View } from '@/components/Themed'
import { BLURHASH } from '@/constants/BLURHASH';
import { DB } from '@/firebase/FirebaseConfig';
import { Result } from '@/types/ResultType';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router'
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Dimensions, Linking, Pressable, ScrollView } from 'react-native';
import { ActivityIndicator, MD2Colors, MD3Colors, Paragraph } from 'react-native-paper';
import { useTailwind } from 'tailwind-rn';
import Constants from 'expo-constants';
import { ChevronLeft, Martini } from 'lucide-react-native';
import { DarkTheme } from '@react-navigation/native';
import YoutubePlayer from "react-native-youtube-iframe";
import RatingComp from '@/components/RatingComp';
import { getDataFromCache, saveDataToCache } from '@/utils/customCacheControl';
import * as WebBrowser from 'expo-web-browser';
import CustomButton from '@/components/CustomButton';
import CommentComponent from '@/components/CommentComponent';




const ArtcileViewScreen = () => {

	const { article_id } = useLocalSearchParams<{
		article_id: string
	}>();

	const tw = useTailwind();

	const HEIGHT = Dimensions.get('window').height;
	const WIDTH = Dimensions.get('window').width;

	const [articleLoading, setArticleLoading] = useState<boolean>(false)
	const [article, setArticle] = useState<Result | undefined>(undefined);

	const getArtcile = async () => {
		setArticleLoading(true);

		const cachedData = await getDataFromCache(`article:${article_id}`); 

		if (cachedData) {
			setArticle(cachedData); 
			setArticleLoading(false); 
			return; 
		}

		const articlesRef = collection(DB, 'Article');

		const q = query(articlesRef,
			where('article_id', '==', article_id)
		);

		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			const articleData = querySnapshot.docs[0].data() as Result;
			setArticle(articleData);

			await saveDataToCache(`article:${article_id}`, articleData);
			
		} else {
			console.log("No such article!");
		}

		setArticleLoading(false);
	}
	function formatDate(dateString: string): string {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
			"Sep", "Oct", "Nov", "Dec"];


		const [datePart, timePart] = dateString.split(' ');
		const [year, month, day] = datePart.split('-').map(Number);
		const [hour, minute] = timePart.split(':').map(Number);

		
		const formattedDate = `${months[month - 1]} ${day}, ${year}, ${hour}:${minute}`;

		return formattedDate;
	}

	const toUpper = (str: string): string => {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}

	const handleClickViewOriginal = async () => { 
		article?.link ? (await WebBrowser.openBrowserAsync(article.link)) : null;
	}


	useEffect(() => {
		getArtcile();
	}, [])

	return (
		<View style={[tw(""), {
			flex: 1,
			backgroundColor: MD2Colors.black,
			height: Dimensions.get('window').height + 30,
			position: 'absolute',
			zIndex: 10,
			minWidth: '100%',


		}]}
		>
			{articleLoading
				?
				(
					<View style={[tw("flex flex-col justify-center self-center"), {
						backgroundColor: 'transparent',
						height: Dimensions.get('window').height,
						width: '100%',
						gap: 8,
					}]}>
						<ActivityIndicator
							theme={DarkTheme}
							color={MD2Colors.blue800}
							animating={true}
							style={tw("self-center")} />
						<Text style={[tw("self-center"), { color: MD2Colors.blue800 }]}>
							Fetching data....
						</Text>
					</View>
				)
				:
				article !== undefined 
					?
				(
					<ScrollView style={[tw("flex flex-col"), {
						backgroundColor: 'transparent',
						height: 'auto',
						paddingBottom: 40,
					}]}>
						<Image
							source={article?.image_url}
							placeholder={BLURHASH}
							style={{
								width: WIDTH,
								height: HEIGHT * 0.30,
							}}
						/>

						<View style={[tw("absolute "), {
							top: Constants.statusBarHeight + 5,
							left: 10,
							backgroundColor: 'transparent',
						}]}>
							<ChevronLeft size={32} color={MD2Colors.white} />
						</View>
							<View style={[tw("absolute "), {
								top: HEIGHT * 0.24,
								left: WIDTH - 100,
								backgroundColor: 'transparent',
								width: 100, 
								height: 100, 
								overflow: 'hidden'
							}]}>
								<CustomButton
									buttonLabel={"View Original"}
									handleClick={handleClickViewOriginal}
								/>
							</View>	

						<View style={[tw("flex flex-col"), {
							padding: 15,
						}]}>
							<View style={[tw(""), {

							}]}>
								<Text style={[tw("font-bold text-xl"), {

								}]}>
									{article.title}
								</Text>
								</View>
								
							<View style={{
								marginTop: 10,
							}}
							>
								<Text style={[tw(""), {
									fontWeight: 'semibold',
									fontSize: 14,
								}]}>
									{article.creator + " / "}{"Updeated: " + formatDate(article.pubDate)}
								</Text>
							</View>

							<View style={[tw("flex flex-row "), {
								overflow: 'visible',
								flexWrap: 'wrap',
							}]}>
								<Text style={[tw("self-center font-semibold"), {
									paddingRight: 6,
								}]}>
									Tag{article.category.length > 1 ? "s" : ""}:
								</Text>
								{article.category.map((category, index) => (
									<View
										key={index}
										style={[tw("flex flex-row items-center justify-around"), {
											backgroundColor: MD3Colors.primary20,
											borderRadius: 6,
											height: 'auto',
											width: 'auto',
											padding: 2,
											paddingHorizontal: 10,
											margin: 4,
											borderColor: 'white',
											borderWidth: 1,
										}]}

									>
										<Text
											key={index}
											style={[tw("text-white font-bold"), {}]}
										>
											{toUpper(category)}
										</Text>
									</View>
								))}
								</View>
								<Pressable style={[tw("self-end flex flex-row items-center"), {
									
								}]}>
									{/* Generate Summary */}
								</Pressable>
							<View style={{
								marginVertical: 10, 
							}}>
								<Paragraph style={[tw("font-semibold"), {
									color: 'white', 
									fontSize: 15, 
								}]}>
									{"    "+article?.description}
								</Paragraph>
							</View>
							{article.video_url
								?
								<View style={{ marginVertical: 10, }}>
									<YoutubePlayer
										height={300}
										play={true}
										videoId={"YQPeKqWWm7M"}
									/>
								</View>
								:
								<></>
							}

							<View style={{marginVertical: 10}}>
								<Paragraph
									selectable={true}
									selectionColor={MD2Colors.blue800}
									style={{
									color: 'white', 
									fontSize: 15, 
									fontWeight: '500', 
									lineHeight: 30, 
								}}>
									{article?.content}
								</Paragraph>
							</View>
							<View style={{ marginVertical: 10 }}>
								<Paragraph
									selectable={true} 
									selectionColor={MD2Colors.blue800}
									style={{
									color: 'white',
									fontSize: 15,
									fontWeight: '500',
									lineHeight: 30,
								}}>
									{article?.full_description}
								</Paragraph>
							</View>
								{!articleLoading
									?
										(
											<>
												<RatingComp />

												<CommentComponent />
											</>
										)
									:
									null
								}
								
						</View>
							<View style={{height: 50,}}>
								
						</View>

					</ScrollView>
					)
					:
					(
						<Text>Articles is not fetched, retry</Text>
					)
				
			}
		</View>
	)
}

export default ArtcileViewScreen