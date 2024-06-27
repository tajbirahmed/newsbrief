import AsyncStorage from "@react-native-async-storage/async-storage";


export const saveDataToCache = async (key: string, data: any) => {
    try {
        const jsonData = JSON.stringify(data);
        await AsyncStorage.setItem(key, jsonData);

    } catch (error) {
        console.error('Error saving data to cache:', error);
    }
};

export const getDataFromCache = async (key: string) => {
    try {
        const jsonData = await AsyncStorage.getItem(key);
        if (jsonData != null) {
            const res = await JSON.parse(jsonData);
            return res; 
        }
    } catch (error) {
        console.error('Error retrieving data from cache:', error);
    }
    return null;
};