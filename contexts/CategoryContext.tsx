import React, { FC, ReactNode, createContext, useContext, useState } from "react";

interface CategoryContextType {
    selected: string | null,
    setSelected: (selected: string | null) => void
}

const CategoryContext = createContext<CategoryContextType | null>(null);

interface CategoryContextProps {
    children: ReactNode
}

const CategoryProvider: FC<CategoryContextProps> = ({ children }) => {
    const [selected, setSelected] = useState<string | null>(null)
    return (
        <CategoryContext.Provider value={{
            selected,
            setSelected
        }}>
            {children}
        </CategoryContext.Provider>
    )
}

const useCategory = () => {
    const context = useContext(CategoryContext);
    if (context === null) {
        throw new Error('useCategory must be used within an CategoryProvider');
    }
    return context;
}

export { CategoryProvider, useCategory }