import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: process.env.apiKey!,
    authDomain: process.env.authDomain!,
    projectId: process.env.projectId!,
    storageBucket: process.env.storageBucket!,
    messagingSenderId: process.env.messagingSenderId!,
    appId: process.env.appId!,
    measurementId: process.env.measurementId!
};


export const FIREBASE_APP = initializeApp(firebaseConfig);
const AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP)