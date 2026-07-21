export type NewsCategory = "company" | "product" | "hr" | "service";

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  company: "חברה",
  product: "מוצר",
  hr: "משאבי אנוש",
  service: "שירות",
};

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  author: string;
  publishedAt: string;
}
