import React, { useEffect, useState } from 'react'
import { Text, View } from '@/components/Themed'
import { Dimensions, Pressable, ScrollView } from 'react-native'
import { ActivityIndicator, MD2Colors } from 'react-native-paper'
import { useTailwind } from 'tailwind-rn'
import { SelectList } from 'react-native-dropdown-select-list'
import  Constants from 'expo-constants'
import {  Search, X } from 'lucide-react-native'
import { Article, Result } from '@/types/ResultType'
import { CustomTextInput } from './CustomTextInput'
import { DarkTheme } from '@react-navigation/native'
import NewsCard from './NewsCard'
import { getDataFromCache, saveDataToCache } from '@/utils/customCacheControl'

import { format } from "date-fns"
import { generateHeadlinePrompts } from '@/prompts/generateHeadlinePrompts'
import { makeOpenAIRequest } from '@/utils/openAiRequest'
import getSummarizationFromUrl from './RapidApiSummateIt'


type ParamOptions = {
    country ?: string, 
    category ?: string, 
    q ?: string
}

const HeadlineScreen = () => {
    const tw = useTailwind(); 
    const HEIGHT = Dimensions.get('window').height; 
    const WIDTH = Dimensions.get('window').width;

    const [preference, setPreference] = useState<string | undefined>(undefined)
    const [selected, setSelected] = useState<string | undefined>(undefined); 
    const [searchText, setSearchText] = useState<string | undefined>(); 
    const [article, setArticle] = useState<Result[]>([]);
    const [loading, setLoading] = useState<boolean>(false); 
    const [showDropDown, setShowDropDown] = useState(false)
    
    const data2 = [
        {
            key: '1', 
            value: 'Choose category',
        }, 
        {
            key: '2',
            value: 'Search'
        }, 

    ]

    const data = [
        {
            key: '1', 
            value: 'Business'
        }, 
        {
            key: '3',
            value: 'Entertainment', 
            
        }, 
        {
            key: '4',
            value: 'General',

        },
        {
            key: '5',
            value: 'Health',

        },
        {
            key: '6', 
            value: 'Sports'
        }, 
        {
            key: '7',
            value: 'Science'
        }, 
        {
            key: '8',
            value: 'Technology', 
        }
    ]

    const convertArticlesToResults = (articles: Article[]): Result[] => {
        return articles.map(article => ({
            article_id: article.source.id,
            title: article.title,
            link: article.url,
            keywords: [], 
            creator: [article.author],
            video_url: null, 
            description: article.description,
            full_description: article.content,
            content: article.content,
            pubDate: article.publishedAt,
            image_url: article.urlToImage,
            source_id: article.source.id,
            source_url: article.url, 
            country: [], 
            category: [], 
            language: 'en', 
        }));
    }

    const handleSummaization = async () => { 
        const response = await makeOpenAIRequest()
        console.log(response);
        
        
    }
    
    const generateCacheKey = (): string => {
        const date = new Date();
        const formattedDate = format(date, 'MM-dd-yyyy');
        const hour = format(date, 'HH');
        return `${formattedDate}-${hour}-${selected}-headline-${1}`;
    };

    const getHeadlines = async () => { 
        let params : ParamOptions = {
            country: "us", 
        }
        if (selected) { 
            params = {
                ...params, 
                category: selected
            }
        }
        if (searchText) { 
            params = {
                ...params, 
                q: searchText
            }
        } 
        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        const url = `https://newsapi.org/v2/top-headlines?${queryString}`
        try {
            setLoading(true);
            const response = await fetch(
                url,
                {
                    headers: {
                        Authorization: process.env.EXPO_PUBLIC_NEWS_API_KEY!
                    },
                    
                },
                
            )
            if (response.ok) {
                const results = await response.json();
                const result_data = convertArticlesToResults(results.articles as Article[]);
                setArticle(result_data); 
                await saveDataToCache(generateCacheKey(), result_data); 
            } else {
                throw new Error("got unexpected error.")
            }
        } catch (error) {
            console.log("[Screen/HeadlineScreen.tsx] " + error);
            
        }
        finally { 
            setLoading(false); 
        }
            
            
        
    }

    const handleHetHeadline = async () => {
        setLoading(true); 
        const cachedData = await getDataFromCache(generateCacheKey()); 
        if (cachedData) {
            console.log('got');
            setArticle(cachedData as Result[])
        } else { 
            await getHeadlines(); 
        }
        setLoading(false)
    }
    const handleSelect = () => { 
        handleHetHeadline();
        setShowDropDown(false);
    }

    useEffect(() => { 
        handleHetHeadline(); 
        handleSummaization(); 
    }, [])

  return (
      <View style={[tw(""), {
          flex: 1,
          backgroundColor: MD2Colors.black,
          height: HEIGHT + 30,
          position: 'absolute',
          zIndex: -10,
          minWidth: '100%',
        

      }]}
      >
          <ScrollView style={[tw("flex flex-col"), {
              backgroundColor: 'transparent',
              height: 'auto',
                paddingBottom: 40,
              marginTop: Constants.statusBarHeight + 10
          }]}>
              <Text style={[tw("p-2"), {
                  fontWeight: '900', 
                  fontSize: 32, 
              }]}>
                  Filter Headlines
            </Text>
              <View style={[tw(`p-2 flex flex-row ${preference ? "justify-between" : "justify-start"}`), {
                  width: '100%',
                  
                  zIndex: 11, 
                  backgroundColor: 'transparent', 
              }]}>
                  <View style={[tw("pt-2"), {
                      width: '45%', 
                        backgroundColor: !selected ? 'transparent' : 'black', 
                    //   zIndex: -12, 
                      
                  }]}>
                      <SelectList
                        setSelected={(val : string) => setPreference(val)}
                        data={data2}
                        save="value"
                        inputStyles={{ color: 'white' }}
                        searchicon={<Search color={'white'} size={14} style={{ marginRight: 10, }} />}
                        closeicon={
                                        <X color={'white'} size={14} style={{ marginLeft: 10, }} />
                                    
                                    }
                        // boxStyles={{ backgroundColor: 'white' }}
                        //   dropdownStyles={{ backgroundColor: 'yellow', borderColor: 'red' }}
                        dropdownTextStyles={{ color: 'white' }}
                        dropdownItemStyles={{  margin: 1 }}
                        dropdownShown={showDropDown}
                        disabledTextStyles={{ color: 'gray' }}
                        placeholder='Choose an option'
                          onSelect={() => { }}
                      />
                  </View>
                  {preference === 'Choose category'
                      ?
                      (
                          <View style={[tw("pt-2"), {
                              width: '45%', 
                            //   backgroundColor:  !preference ? 'transparent' : 'black', 
                          }]}>
                      <SelectList
                          setSelected={(val: string) => setSelected(val)}
                          data={data}
                          save="value"
                          inputStyles={{ color: 'white' }}
                          searchicon={<Search color={'white'} size={14} style={{ marginRight: 10, }} />}
                          closeicon={
                              <X color={'white'} size={14} style={{ marginLeft: 10, }} />

                          }
                          // boxStyles={{ backgroundColor: 'white' }}
                          //   dropdownStyles={{ backgroundColor: 'yellow', borderColor: 'red' }}
                          dropdownTextStyles={{ color: 'white' }}
                          dropdownItemStyles={{ margin: 1 }}

                          disabledTextStyles={{ color: 'gray' }}
                          placeholder='Categories'
                                //   dropdownShown={false}
                                  onSelect={handleSelect}
                                //   dropdownShown={!showDropDown}
                              />
                            </View>
                        )
                      :
                      preference === 'Search'
                          ?
                          (
                              <CustomTextInput 
                                  label={'Search'} 
                                  content={searchText as string}
                                  setContent={setSearchText}
                                  
                              />
                          )
                          :
                          (
                              null
                          )
                          
                }
              </View>
              {/* Summarize headlines */}
              {loading
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
                  :
                  (
                      <View style={[tw("mt-8"), {}]}>

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
                          
                      </View>
                  )

              }
          </ScrollView>
          </View>
  )
}

export default HeadlineScreen