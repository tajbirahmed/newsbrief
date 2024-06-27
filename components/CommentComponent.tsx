import React from 'react'
import { View } from '@/components/Themed'
import { useTailwind } from 'tailwind-rn'
import PostComment from './PostComment';
import ViewComment from './ViewComment';

const CommentComponent = () => {
    const tw = useTailwind();
    return (
        <View style={{}}>
            
            
                <PostComment />
                <ViewComment />
            

        </View>
    )
}

export default CommentComponent