import axios from 'axios';



export const makeOpenAIRequest = async () => {
    try {
        console.log(process.env.EXPO_PUBLIC_OPEN_AI_API_KEY);
        
        const url = 'https://api.openai.com/v1/completions'
        const response = await fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPEN_AI_API_KEY!}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({
                    "model": "davinci-002",
                    "messages": [
                        {
                            "role": "system",
                            "content": "The following is a summary of the article"
                        }
                    ],
                    "temperature": 0,
                    "max_tokens": 100,
                    "top_p": 1,
                    "frequency_penalty": 0.0,
                    "presence_penalty": 0.0,
                    "stop": ["\n"]
                }),
            });
            const result = await response.json();
        return result;
    } catch (error) {
        console.error("[utils/openAiRequest.ts] " + error);
    }
    return "Summary generation failed due to internal error"

};