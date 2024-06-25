import React, { FC, ReactNode, createContext, useContext, useState } from "react";

interface ScreenContextType {
    screen: string,
    setScreen: (screen: string) => void
}

const ScreenContext = createContext<ScreenContextType | null>(null);

interface CategoryContextProps {
    children: ReactNode
}

const ScreenProvider: FC<CategoryContextProps> = ({ children }) => {
    const [screen, setScreen] = useState<string>('Home')
    return (
        <ScreenContext.Provider value={{
            screen,
            setScreen
        }}>
            {children}
        </ScreenContext.Provider>
    )
}

const useScreen = () => {
    const context = useContext(ScreenContext);
    if (context === null) {
        throw new Error('useScreen must be used within an ScreenProvider');
    }
    return context;
}

export { ScreenProvider, useScreen }