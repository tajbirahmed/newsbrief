import { Result } from "@/types/ResultType"

export const generateHeadlinePrompts = (articles: Result[]) => {
    const promptArray = articles.map(article => ({
        article_id: article.article_id,
        title: article.title,
        link: article.link,
        description: article.description,
        full_description: article.full_description,
        content: article.content,
        pubDate: article.pubDate,
        image_url: article.image_url,
        source_id: article.source_id,
        source_url: article.source_url,
        language: article.language
    }));
    const promptString = JSON.stringify(promptArray, null, 2);
    return (`Given the following array of articles, create concise and precise summaries for each article. Each summary should include the article's title as the headline and the link to the full article. The headline should give importance to the title and also consider the description, full_description, and content to provide a meaningful summary. Ignore unrelated fields such as keywords, video_url, creator, pubDate, image_url, source_id, source_url, country, category, language, ai_tag, ai_region, sentiment, and sentiment_stats.

            Array of articles:
            ${promptString}
            Expected output format:

            [
                { "headline": "Title 1 - Short description 1", "link": "http://link1.com" },
                { "headline": "Title 2 - Short description 2", "link": "http://link2.com" }
                // Corresponding summaries for each article
            ]
            `
    )
}