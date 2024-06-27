import React, { FC, ReactNode, createContext, useContext, useState } from "react";

interface UserNameContextType {
    userName: string,
    setUserName: (comment: string) => void
}

const UserNameContext = createContext<UserNameContextType | null>(null);

interface UserNameContextProps {
    children: ReactNode
}

const UserNameProvider: FC<UserNameContextProps> = ({ children }) => {
    const [userName, setUserName] = useState<string>('');
    return (
        <UserNameContext.Provider value={{
            userName,
            setUserName, 
        }}>
            {children}
        </UserNameContext.Provider>
    )
}

const useUserName = () => {
    const context = useContext(UserNameContext);
    if (context === null) {
        throw new Error('useUserName must be used within an UserNameProvider');
    }
    return context;
}

export { UserNameProvider, useUserName }