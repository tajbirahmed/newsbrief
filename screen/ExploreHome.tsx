import React, { useDebugValue, useEffect, useRef, useState } from 'react'
import { Text, View } from '@/components/Themed'
import { ActivityIndicator, MD2Colors } from 'react-native-paper'
import { Dimensions, Pressable, ScrollView } from 'react-native'
import { useTailwind } from 'tailwind-rn'
import HeaderBar from '@/components/Header'
import { useDrawer } from '@/contexts/DrawerContext'
import { useScreen } from '@/contexts/ScreenContext'
import HorizontalCategoryComponent from '@/components/HorizontalCategoryComponent'
import { fetchData } from '@/utils/fetchArticles'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { Result } from '@/types/ResultType';
import { useCategory } from '@/contexts/CategoryContext'
import { router, useLocalSearchParams } from 'expo-router'
import { DarkTheme } from '@react-navigation/native'
import NewsCard from '@/components/NewsCard'
import {  ChevronsLeft, ChevronsRight } from 'lucide-react-native'
import { usePage } from '@/contexts/PaginationContext'

const ExploreHome = () => {
	const tw = useTailwind();

	const {
		open,
		setOpen
	} = useDrawer();

	const {
		screen,
		setScreen
	} = useScreen();

	const {
		selected,
		setSelected
	} = useCategory();

	const { id } = useLocalSearchParams<{
		id: string
	}>();

	const {
		page,
		setPage
	} = usePage(); 
	const [articles, setArticles] = useState<Result[]>([]);
	const [nxtPage, setNxtPage] = useState<string | null>(null);
	const [pageLoading, setPageLoading] = useState<boolean>();
	const [navArray, setNavArray] = useState<number[]>(generateNumberArray(page));
	const [trigger, setTrigger] = useState<boolean>(false)
	const nxtPageRef = useRef(nxtPage);

	const generateCacheKey = ({ currPage }: { currPage: number }): string => {
		const date = new Date();
		const formattedDate = format(date, 'MM-dd-yyyy');
		const hour = format(date, 'HH');
		return `${formattedDate}-${hour}-${selected}-explore-${currPage}`;
	};

	const saveDataToCache = async (key: string, data: any) => {
		try {
			const jsonData = JSON.stringify(data);
			await AsyncStorage.setItem(key, jsonData);

		} catch (error) {
			console.error('Error saving data to cache:', error);
		}
	};

	const getDataFromCache = async (key: string): Promise<boolean> => {
		try {
			const jsonData = await AsyncStorage.getItem(key);
			if (jsonData != null) {
				const res = await JSON.parse(jsonData);
				const {
					results,
					nextPage
				} = res;
				setArticles(results);
				setNxtPage(nextPage);
				setPageLoading(false);
				return true;
			}
		} catch (error) {
			console.error('Error retrieving data from cache:', error);
		}
		setPageLoading(false);
		return false;
	};

	const deleteDataFromCache = async (key: string): Promise<void> => {
		try {
			await AsyncStorage.removeItem(key);
			console.log("del success");
		} catch (error) {
			console.error('Error deleting data from cache:', error);
		}
	};

	const handleFetchArticles = async () => {
		setPageLoading(true);
		const cacheStatus = await getDataFromCache(generateCacheKey({ currPage: page }));
		if (cacheStatus) return;
		setPageLoading(true);
		let additionalParams = {}
		if (selected) {
			additionalParams = {
				category: selected.toLowerCase()
			}
		}
		const currentNxtPage = nxtPageRef.current;
		if (currentNxtPage !== null) {
			additionalParams = {
				...additionalParams,
				nextPage: currentNxtPage
			}
		}
		const axiosInstance = axios.create({
			method: 'GET',
			baseURL: 'https://newsdata.io/api/1/',
			timeout: 5000,
			params: {
				apiKey: process.env.EXPO_PUBLIC_NEWS_DATA_API_KEY,
				Language: 'en'
			}
		});


		let url = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_NEWS_DATA_API_KEY}&language=en`
		if (selected !== null) url += `&category=${selected.toLowerCase()}`;
		if (currentNxtPage !== null) url += `&nextpage=${currentNxtPage}`;
		console.log(url);
		
		const {
			data
		} = await fetchData({
			axiosInstance,
			url
		});
		const {
			results,
			nextPage
		} = data;
		setNxtPage(nextPage);
		setArticles(results);
		setPageLoading(false);
		await saveDataToCache(generateCacheKey({ currPage: page }), data);


	}

	function generateNumberArray(x: number): number[] {
		if (x === 1) {
			return [x, x + 1, x + 2, x + 3, x + 4];
		} else if (x === 2) {
			return [x - 1, x, x + 1, x + 2, x + 3];
		} else if (x === 9) {
			return [x - 3, x - 2, x - 1, x, x + 1];
		} else if (x === 10) {
			return [x - 4, x - 3, x - 2, x - 1, x];
		}
		return [x - 2, x - 1, x, x + 1, x + 2];
		
	}

	 
	const handePageSelect = (val: number) => {
		setPage(val); 
		// handle val < 1 and val > 10
		router.replace(`/home/app/explore/${val}`);

	}
	
	useEffect(() => {
		id && setPage(parseInt(id));
		id && setNavArray(generateNumberArray(parseInt(id)));
	}, [])

	useEffect(() => {
		setScreen('Explore');
		handleFetchArticles();
		console.log(page);
		console.log(selected);
		
	}, []);

	

	useEffect(() => { 
		nxtPageRef.current = nxtPage;
	}, [nxtPage])

	useEffect(() => { 

		setNxtPage(null); 
		setTrigger(true);

	}, [selected])
	
	useEffect(() => {
		if (trigger) {
			handleFetchArticles()
				.then(() => {
					setTrigger(false); 
				});
		}
	}, [trigger]);

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
			<ScrollView style={[tw("flex flex-col"), {
				backgroundColor: 'transparent',
				height: 'auto',
				paddingBottom: 40,
			}]}>

				<HeaderBar
					open={open}
					setOpen={setOpen}
					meesage={"Explore in News"}
				/>
				<HorizontalCategoryComponent

				/>


				{pageLoading
					?
					(
						<View style={[tw("flex flex-col justify-center self-center"), {
							backgroundColor: 'transparent',
							height: Dimensions.get('window').height - 150,
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
					: (
						<>
							{
								articles.map((val, ind) => (
									<View key={ind} style={{}}>
										<NewsCard
											article={val}
										/>
									</View>

								))
							}
							<View style={[tw(""), {
								height: 105,
								width: Dimensions.get('window').width, 
								alignSelf: 'center',
								borderRadius: 40,
								marginBottom: 10

							}]}>
								<View style={[tw("flex flex-row items-center justify-center"), {
									width: '100%', 
									height: 60, 
									// backgroundColor: MD2Colors.blue900,
								}]}>
									<Pressable
										onPress={() => handePageSelect(page - 1)}
										style={{ paddingHorizontal: 8 }} >
										<ChevronsLeft color="white" size={20}/>
									</Pressable>
									{navArray.map((val, ind) => (
										<Pressable
											onPress={() => handePageSelect(val)}
											key={ ind }
											style={[tw("self-center"),{
												paddingHorizontal: 6,
												backgroundColor: val === page ? MD2Colors.green800 : 'transparent',
												borderRadius: 12, 
												height: 24,
												width: 35,
												
											}]}>
											<Text
												style={[tw("text-white"), {
													fontSize: 20, 
													fontWeight: val === page ? "900" : "normal", 
													alignSelf: 'center', 
												}]}
											>
												{val}
											</Text>
										</Pressable>
									))}
									{!navArray.includes(10) ?  (
										<>
											<Text
												style={[tw("text-white"), {
												fontSize: 10,
												alignSelf: 'center',
											}]}>
												{ "..."}
										</Text>
											<Pressable
												onPress={() => { handePageSelect(10)}}
												style={[tw("self-center"), {
											paddingHorizontal: 6,
											backgroundColor: page === 10 ? MD2Colors.green800 : 'transparent',
											borderRadius: 12,
											height: 24,
													width: 35,
											overflow: 'visible',

										}]}>
										<Text
												style={[tw("text-white"), {
													fontSize: 20,
													fontWeight: page === 10 ? "900" : "normal",
													alignSelf: 'center',
													overflow: 'visible',

												}]}
											>

										{"10"}
											</Text>
										</Pressable></>
									) : <></>}
									<Pressable
										onPress={() => handePageSelect(page + 1)}
										style={{ paddingHorizontal: 8 }} >
										<ChevronsRight color="white" size={22} />
									</Pressable>
								</View>
							</View>
						</>
					)
				}

				

			</ScrollView>
		</View>
	)
}

export default ExploreHome