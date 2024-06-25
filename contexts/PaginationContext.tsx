import React, { FC, ReactNode, createContext, useContext, useState } from "react";

interface PaginationContextType {
    page: number,
    setPage: (page: number) => void
}

const PaginationContext = createContext<PaginationContextType | null>(null);

interface PaginationContextProps {
    children: ReactNode
}

const PageProvider: FC<PaginationContextProps> = ({ children }) => {
    const [page, setPage] = useState<number>(1);
    return (
        <PaginationContext.Provider value={{
            page,
            setPage
        }}>
            {children}
        </PaginationContext.Provider>
    )
}

const usePage = () => {
    const context = useContext(PaginationContext);
    if (context === null) {
        throw new Error('usePage must be used within an PageProvier');
    }
    return context;
}

export { PageProvider, usePage }