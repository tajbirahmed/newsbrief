import React, { FC, ReactNode, createContext, useContext, useState } from "react";

interface PasswordContextType {
    pass: string,
    setPass: (pass: string) => void
}

const EmailContext = createContext<PasswordContextType | null>(null);

interface EmailContextProps {
    children: ReactNode
}

// is this secure?

const PassProvider: FC<EmailContextProps> = ({ children }) => {
    const [pass, setPass] = useState<string>('');
    return (
        <EmailContext.Provider value={{
            pass,
            setPass
        }}>
            {children}
        </EmailContext.Provider>
    )
}

const usePass = () => {
    const context = useContext(EmailContext);
    if (context === null) {
        throw new Error('usePass must be used within an AuthProvider');
    }
    return context;
}

export { PassProvider, usePass }