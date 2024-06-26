import { FIREBASE_AUTH } from "@/firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import React, { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";

interface ProfileImageUrlContextType {
    profileImageUrl: string,
    setProfileImageUrl: (pass: string) => void
}

const ProfileImageUrlContext = createContext<ProfileImageUrlContextType | null>(null);

interface ProfileImageUrlContextProps {
    children: ReactNode
}

const ProfileImageUrlProvider: FC<ProfileImageUrlContextProps> = ({ children }) => {
    const [profileImageUrl, setProfileImageUrl] = useState<string>(''); 
    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                if (user.photoURL)
                    setProfileImageUrl(user.photoURL);
            }
        })
    }, [])
    return (
        <ProfileImageUrlContext.Provider value={{
            profileImageUrl,
            setProfileImageUrl
        }}>
            {children}
        </ProfileImageUrlContext.Provider>
    )
}

const useProfileImage = () => {
    const context = useContext(ProfileImageUrlContext);
    if (context === null) {
        throw new Error('useProfileImage must be used within an ProfileImageUrlProvider');
    }
    return context;
}

export { ProfileImageUrlProvider, useProfileImage }