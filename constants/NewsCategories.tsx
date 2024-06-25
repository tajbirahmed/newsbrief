// newsCategories.ts

export interface NewsCategory {
    categoryName: string;
}

const NewsCategories: NewsCategory[] = [
    { categoryName: "business" },
    { categoryName: "education" },
    { categoryName: "entertainment" },
    { categoryName: "environment" },
    { categoryName: "politics" },
    { categoryName: "sports" },
    { categoryName: "technology" },
];

export default NewsCategories;
