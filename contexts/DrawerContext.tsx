import React, { FC, ReactNode, createContext, useContext, useState } from "react";

interface DrawerType {
    open: boolean,
    setOpen: (open: boolean) => void
}



const DrawerContext = createContext<DrawerType | null>(null);

interface EmailContextProps {
    children: ReactNode
}

const DrawerProvider: FC<EmailContextProps> = ({ children }) => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <DrawerContext.Provider value={{
            open,
            setOpen
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