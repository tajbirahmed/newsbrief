import React, { FC, ReactNode, createContext, useContext, useState } from "react";

export type DrawerContentType = 
    "google-news"
|   "settings"
|   undefined

interface DrawerType {
    open: boolean; 
    setOpen: (open: boolean) => void; 
    selected: DrawerContentType; 
    setSelected: (selected: DrawerContentType) => void;
}



const DrawerContext = createContext<DrawerType | null>(null);

interface EmailContextProps {
    children: ReactNode
}

const DrawerProvider: FC<EmailContextProps> = ({ children }) => {
    const [open, setOpen] = useState<boolean>(true); 
    const [selected, setSelected] = useState<DrawerContentType>(undefined)
    return (
        <DrawerContext.Provider value={{
            open,
            setOpen,
            selected, 
            setSelected
        }}>
            {children}
        </DrawerContext.Provider>
    )
}

const useDrawer = () => {
    const context = useContext(DrawerContext);
    if (context === null) {
        throw new Error('useDrawer must be used within an AuthProvider');
    }
    return context;
}

export { DrawerProvider, useDrawer }