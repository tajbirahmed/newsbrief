import axios from 'axios';



const getSummarizationFromUrl = async (url: string) => { 
    const options = {
        method: 'GET',
        url: 'https://article-extractor-and-summarizer.p.rapidapi.com/summarize',
        params: {
            url,
            length: '1',
            lang: 'en',
            engine: '2'
        },
        headers: {
            'x-rapidapi-key': '5e23ee0f79msh7e77a6ee6d59b0dp19dcbejsn0d09fff62596',
            'x-rapidapi-host': 'article-extractor-and-summarizer.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
    return "Summary generation failed due to internal error"
}

export default getSummarizationFromUrl;