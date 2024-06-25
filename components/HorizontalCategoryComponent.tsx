import NewsCategories from '@/constants/NewsCategories'
import React, { useState } from 'react'
import { Pressable, ScrollView } from 'react-native'
import Category from './Category'
import { MD2Colors } from 'react-native-paper'
import { useCategory } from '@/contexts/CategoryContext'

const HorizontalCategoryComponent = () => {
    const {
        selected,
        setSelected
    } = useCategory(); 

    const toUpper = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    

    return (
        <ScrollView
            style={{
                height: '6%',
                width: 'auto',
                overflow: 'scroll',
                flexDirection: 'row',
                paddingTop: 4,
                padding: 2,

            }}
            horizontal={true}
        >
            {NewsCategories.map((value, index) => (
                <Pressable
                    key={index}
                    style={{
                        justifyContent: 'center',
                        borderWidth: selected === value.categoryName ? 0.3 : 0.3, 
                        borderColor: 'gray',
                        backgroundColor: selected === value.categoryName ? MD2Colors.green800 : 'transparent',
                        padding: 2,
                        marginHorizontal: 3,
                        borderRadius: 5,
                        alignSelf: 'center', 
                        
                    }}
                    onPress={() => {
                        if (selected === value.categoryName) { 
                            setSelected(null);
                        } else setSelected(value.categoryName)
                    }}

                >
                    <Category
                        key={index}
                        categoryName={toUpper(value.categoryName)}
                    />
                    {/* need work on selected */}
                </Pressable>

            ))}
        </ScrollView>
    )
}

export default HorizontalCategoryComponent