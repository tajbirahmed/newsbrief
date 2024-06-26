import React from 'react'
import { Text, View } from '@/components/Themed'
import { useTailwind } from 'tailwind-rn'

interface CoutMesaageProps { 
    count: number, 
    message: string
}

const CountMesaageComponent = ({ 
    count,
    message
} : CoutMesaageProps) => {
    const tw = useTailwind(); 
    const  countBeautify = () : string =>{
        if (count >= 1000)
            return `${count / 1000}K`
        return `${count}`
    }
    return (
        <View style={[tw("flex flex-col justify-center"), {
            backgroundColor: 'transparent'
        }]}>
            <Text
                style={[tw("self-center"), {
                    fontWeight: 'semibold', 
                    fontSize: 24, 
                    
                }]}
            >{countBeautify()}
            </Text>
            <Text
                style={[tw("self-center"), {
                    fontWeight: 'normal',
                    fontSize: 14,
                }]}
            >{message}
            </Text>
    </View>
  )
}

export default CountMesaageComponent