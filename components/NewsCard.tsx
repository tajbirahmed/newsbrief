import * as React from 'react';
import { Button, Card, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { LucideBookMarked } from 'lucide-react-native';
import { Result } from '@/types/ResultType';


interface PageProps {
    article: Result;
}

const NewsCard = ({
    article
}: PageProps) => {

    const handleReadMore = () => { 
        
    }

    return (
        <Card mode="contained" style={styles.card}>

            <Card.Cover source={{ uri: article.image_url }} style={[styles.cover]} />

            <Card.Title
                title={article.title}
                titleStyle={styles.title}
                right={(props) => <LucideBookMarked {...props} color='white' />}
            />
            <Card.Content>
                <Text numberOfLines={4} variant="bodyMedium" style={styles.snippet}>{article.description}</Text>
                <Text variant="bodySmall" style={styles.pubDate}>{new Date(article.pubDate).toDateString()}</Text>
            </Card.Content>
            <Card.Actions>
                <Button mode="contained" onPress={handleReadMore} style={styles.button}>Read More</Button>
                <Button mode="contained" onPress={() => { }} style={styles.button}>Share</Button>
            </Card.Actions>
        </Card>
    )
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'black',
        margin: 16,
        borderRadius: 8,
        elevation: 4,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
    },
    cover: {
        marginTop: 16,
    },
    headline: {
        color: 'white',
        marginTop: 8,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    snippet: {
        color: 'gray',
    },
    button: {
        margin: 8,
    },
    pubDate: {
        color: 'gray',
        marginTop: 4,
    },
});

export default NewsCard;
