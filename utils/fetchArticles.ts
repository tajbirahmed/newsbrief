import axios, { Axios, AxiosInstance } from 'axios';



interface ApiCallProps { 
    axiosInstance: AxiosInstance; 
    url: string;
}


export const fetchData = async ({ 
    axiosInstance, 
    url
} : ApiCallProps) => { 
    
    try {
        const response = await axiosInstance.get(url);
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Error while fetching articles: ${error}`);
    }
        
}