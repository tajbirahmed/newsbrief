import React, { FC, ReactNode, createContext, useContext, useState } from "react";

interface EmailContextType {
    email: string | null, 
    setEmail: (email : string | null) => void
}

const EmailContext = createContext<EmailContextType | null>(null);

interface EmailContextProps {
    children: ReactNode
}

const EmailProvider: FC<EmailContextProps> = ({ children }) => {
    const [email, setEmail] = useState<string | null>(null)
    return (
        <EmailContext.Provider value={{
            email,
            setEmail
        }}>
            {children}
        </EmailContext.Provider>
    )
}

const useEmail = () => {
    const context = useContext(EmailContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { EmailProvider, useEmail }