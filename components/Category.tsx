import React from 'react'
import { View, Text } from  "@/components/Themed"

interface CategoryProps {
    category_id?: number,
    categoryName: string,
}
const Category = ({
    categoryName,
}: CategoryProps) => {

    return (
        <View
            style={{
                minWidth: 30,
                height: '100%',
                paddingRight: 4,
                marginRight: 4,
                paddingLeft: 4,
                marginLeft: 4,
                backgroundColor: 'none',
            }}
        >
            <Text
                style={{
                    fontSize: 17,
                    color: 'white',
                    fontWeight: '600',
                    alignSelf: 'flex-start',
                    backgroundColor: 'none',

                }}
            >
                {categoryName}
            </Text>
        </View>

    )
}

export default Category