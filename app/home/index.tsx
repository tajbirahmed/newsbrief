import React from 'react'
import { View } from '@/components/Themed'
import { Text } from '@/components/Themed'
import { useTailwind } from 'tailwind-rn'

const Home = () => {
  const tw = useTailwind(); 
  return (
    <View style={tw("h-auto")}>
          <Text>
            abctttttttttttt
            </Text> 
    </View>
  )
}

export default Home