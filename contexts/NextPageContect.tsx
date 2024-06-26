import React, { FC, ReactNode, createContext, useContext, useState } from "react";

interface NextPageContextType {
    nxtPage: string | null,
    setNxtPage: (nxtPage: string | null) => void
}

const NextPageContext = createContext<NextPageContextType | null>(null);

interface NextPageContextProps {
    children: ReactNode
}

const NextPageProvider: FC<NextPageContextProps> = ({ children }) => {
    const [nxtPage, setNxtPage] = useState<string | null>(null)
    return (
        <NextPageContext.Provider value={{
            nxtPage,
            setNxtPage
        }}>
            {children}
        </NextPageContext.Provider>
    )
}

const useNxtPage = () => {
    const context = useContext(NextPageContext);
    if (context === null) {
        throw new Error('useNxtPage must be used within an NextPageProvider');
    }
    return context;
}

export { NextPageProvider, useNxtPage }