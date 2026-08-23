import { Article } from '../types';
import { INSIGHTS_ARTICLES, getLocalizedArticle } from './insights';

export const MOCK_ARTICLES: Article[] = INSIGHTS_ARTICLES.map((raw) => {
  const insight = getLocalizedArticle(raw, 'en');
  return {
    id: insight.id,
    title: insight.title,
    excerpt: insight.description,
    content: `${insight.introduction}\n\n${insight.sections
      .map((s) => `### ${s.heading}\n${s.content.join('\n')}${s.listItems ? '\n' + s.listItems.map((li) => `- ${li}`).join('\n') : ''}`)
      .join('\n\n')}`,
    category:
      insight.category === 'soil-npk'
        ? 'NPK Science'
        : insight.category === 'sustainable-farming'
        ? 'Sustainable Agri'
        : insight.category === 'fertilizers'
        ? 'Fertilizer Guide'
        : 'Soil Health',
    readTime: insight.readTime,
    author: insight.author,
    date: insight.publishedDate,
    imageUrl: insight.image,
    tags: [insight.categoryLabel, 'Agronomy', 'Precision Farming'],
  };
});
