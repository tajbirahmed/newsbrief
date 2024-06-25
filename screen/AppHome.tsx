import React, { useEffect, useState } from 'react'
import { Text, View } from '@/components/Themed'
import { useTailwind } from 'tailwind-rn'
import { Dimensions, Pressable, ScrollView } from 'react-native';
import HeaderBar from '@/components/Header';
import { useDrawer } from '@/contexts/DrawerContext';
import HorizontalCategoryComponent from '@/components/HorizontalCategoryComponent';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { DarkTheme } from '@react-navigation/native';
import { useCategory } from '@/contexts/CategoryContext';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { DB } from '@/firebase/FirebaseConfig';
import { Result } from '@/types/ResultType';
import NewsCard from '@/components/NewsCard';
import { exampleNews } from '@/constants/EXAMPLENEWS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from "date-fns"
import { useScreen } from '@/contexts/ScreenContext';

const AppHome = () => {

    const tw = useTailwind();
    const {
        open,
        setOpen
    } = useDrawer();

    const {
        screen,
        setScreen
    } = useScreen(); 

    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [loading, setloading] = useState<boolean>(false)
    const [noArticle, setNoArticle] = useState(5);
    const [article, setArticle] = useState<Result[]>([]);

    const {
        selected,
        setSelected
    } = useCategory();
    
    function getRandomInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const generateCacheKey = (): string => {
        const date = new Date();
        const formattedDate = format(date, 'MM-dd-yyyy');
        const hour = format(date, 'HH');
        return `${formattedDate}-${hour}-${selected}`;
    };

    const saveDataToCache = async (key: string, data : Result[]) => {
        try {
            const jsonData = JSON.stringify(data);
            await AsyncStorage.setItem(key, jsonData);
            console.log("success");
            
        } catch (error) {
            console.error('Error saving data to cache:', error);
        }
    };

    const getDataFromCache = async (key: string) : Promise<boolean> => {
        try {
            const jsonData = await AsyncStorage.getItem(key);
            if (jsonData != null) {
                const res = await JSON.parse(jsonData) as Result[];
                setArticle(res);
                return true;
            }
        } catch (error) {
            console.error('Error retrieving data from cache:', error);
        }
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

    const handleLoadMore = async () => {
        const randomInt = getRandomInteger(3, 5);
        setNoArticle((prev) => prev + randomInt);
        await deleteDataFromCache(generateCacheKey());
        await getArticle();
    }

    const getArticle = async () : Promise<void> => {
        const cacheStatus = await getDataFromCache(generateCacheKey()); 
        if (cacheStatus) return; 
        const colRef = collection(DB, "Article");
        let q; 
        if (selected) {
            q = query(
                colRef,
                limit(noArticle),
                orderBy('date_added', 'desc'),
                where('category', 'array-contains', selected)
            );
        } else { 
            q = query(
                colRef,
                limit(noArticle),
                orderBy('date_added', 'desc'),
                // where('category', 'array-contains', selected)
            );
        }
        try {
            noArticle === 5
                ?
                setPageLoading(true)
                :
                setloading(true);
            const e = await getDocs(q);
            const res: Result[] = [];
            e.forEach((doc) => {
                res.push(doc.data() as Result);
            });

            setArticle(res);
            await saveDataToCache(generateCacheKey(), res);

        } catch (error) {
            console.error(error);
        } finally {
            setPageLoading(false)
            setloading(false);

        }
    }

    

    useEffect(() => {
        const newsData = [exampleNews, exampleNews];
        // setArticle(newsData)
        
            getArticle();
    }, [selected])

    useEffect(() => { 
        setScreen('Home');
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
            <ScrollView style={[tw("flex flex-col"), {
                backgroundColor: 'transparent',
                height: 'auto',
                paddingBottom: 40,
            }]}>
                <HeaderBar
                    open={open}
                    setOpen={setOpen}
                    meesage={"Search in News"}
                />
                <HorizontalCategoryComponent />
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
                                Fetchin data....
                            </Text>
                        </View>
                    )
                    : (
                        <>
                            {
                                article.map((val, ind) => (
                                    <View key={ind} style={{}}>
                                        <NewsCard
                                            // key={ind}
                                            article={val}
                                        />
                                    </View>

                                ))
                            }
                            <View style={[tw(""), {
                                height: 115,
                                // backgroundColor: 'yellow', 

                            }]}>
                                <View style={[tw("self-center flex flex-row justify-center items-center"), {
                                    height: 45,
                                    width: '40%',
                                    borderWidth: 2, 
                                    borderColor: MD2Colors.blue900, 
                                    borderRadius: 20, 
                                    shadowColor: MD2Colors.blue100, 
                                    shadowOffset: {
                                        width: 10,
                                        height: 10
                                    },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 5,
                                    // Shadow for Android
                                    elevation: 10,
                                }]}> 
                                    <Pressable
                                        onPress={ handleLoadMore }
                                    >
                                        {!loading
                                            ? 
                                            (
                                                <Text style={tw("font-semibold")}>
                                                    Load More
                                                </Text>
                                            )
                                            :
                                            (
                                                <ActivityIndicator color={MD2Colors.blue800} />
                                            )
                                        }
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

export default AppHome