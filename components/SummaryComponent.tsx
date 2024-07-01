import { AtomIcon } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { Text, View } from '@/components/Themed'
import { useTailwind } from 'tailwind-rn'
import { ActivityIndicator, MD2Colors, Paragraph } from 'react-native-paper'
import { Typewriter } from './TypeWritter'
import { getDataFromCache, saveDataToCache } from '@/utils/customCacheControl'
import { useLocalSearchParams } from 'expo-router'

const SummaryComponent = ({
    text
}: {
    text: string
}) => {
    const tw = useTailwind(); 
   
    const { article_id } = useLocalSearchParams<{
        article_id: string
    }>();

    const [loading, setLoading] = useState<boolean>(false)
    const [summarizedText, setSummarizedText] = useState<string | undefined>();



    const getSummary = async () => { 
        
        const cachedData = await getDataFromCache(`article:summary:huggingface:${article_id}`)

        if ((cachedData && summarizedText) || summarizedText === undefined) {
            try {
                const data = {
                    inputs: text,
                    min_length: 70,
                    max_length: 150,
                }
                setLoading(true);
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_KEY_SUMMARIZATION}`
                        },
                        method: 'POST',
                        body: JSON.stringify(data),
                        
                    }
                )
                const results = await response.json();
                await saveDataToCache(`article:summary:huggingface:${article_id}`, results);
                // console.log(results);
                setSummarizedText(results[0].summary_text);

            } catch (error) {
                console.log("Components/SummaryComponent.tsx: Error while fetching summary: ", error)
            }
            finally {
                setLoading(false);
            }
        }
        if (cachedData) {
            setSummarizedText(cachedData[0].summary_text); 
        }
    } 

    useEffect(() => { 
        const getCachedData = async () => { 
            const cachedData = await getDataFromCache(`article:summary:huggingface:${article_id}`)
            if (cachedData) {
                setSummarizedText(cachedData[0].summary_text);
            }
        }
        getCachedData(); 
    }, [])

  return (
      <View style={[tw("flex flex-col"), {
          flexDirection: 'column-reverse',
      }]}>
          
          <Pressable
              style={[tw("self-end flex flex-row items-center justify-center mr-3 p-2 px-3 rounded-lg"), {
                  backgroundColor: MD2Colors.deepPurple400

              }]}
              onPress={getSummary}
          >
              {!loading
                  ?
                  <>
                      {/* <Animated.View style={animatedStyle}> */}
                      <AtomIcon color={'white'} style={[tw("mr-3")]} />
                      {/* </Animated.View> */}
                      <Text style={[tw("font-bold")]}>{
                          !summarizedText
                              ?
                              "Generate Summary"
                              :
                              "Regenerate"
                      }</Text>
                  </> 
                  :
                  <View style={[tw("flex flex-row items-center justify-center mr-3"), {
                      backgroundColor: MD2Colors.deepPurple400
                  }]}>
                      <ActivityIndicator size={"small"} color={MD2Colors.blue800} style={[tw("mr-3")]} />
                      <Text style={[tw("font-bold")]}>Generating...</Text>
                  </View>
                } 
            </Pressable>
          {!loading && summarizedText
              
              ? 
              <Paragraph
                  dataDetectorType='all'
                  style={[tw("m-1"), {
                      fontSize: 16,
                      color: 'white',
                      backgroundColor: '#201c24',
                      borderRadius: 20,
                      padding: 8,
                      fontWeight: '500'
                  }]}>
                  {summarizedText}
              </Paragraph>
              :
              null
            }
            
      </View>
  )
}

export default SummaryComponent