import { User } from "firebase/auth";
import React, { FC, ReactNode, createContext, useContext, useState } from "react";


export interface AuthContextType {
    user: User | null; 
    setUser: (user : User | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null); 

interface AuthContextProps { 
    children: ReactNode
}

const AuthProvider : FC<AuthContextProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    return (
        <AuthContext.Provider value={{
            user, 
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext); 
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider'); 
    }
    return context; 
}

export { AuthProvider, useAuth }