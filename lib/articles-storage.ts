import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');

export interface Article {
  id: string;
  slug: string;
  title: {
    en: string;
    hy: string;
    ru: string;
    ar: string;
  };
  content: {
    en: string;
    hy: string;
    ru: string;
    ar: string;
  };
  excerpt: {
    en: string;
    hy: string;
    ru: string;
    ar: string;
  };
  category: 'events' | 'culture' | 'food-drinks' | 'destinations' | 'news';
  tags: string[];
  author: string;
  imageUrl?: string;
  videoUrl?: string;
  status: 'draft' | 'published';
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read all articles
export async function readArticles(): Promise<Article[]> {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(ARTICLES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty array
    await writeArticles([]);
    return [];
  }
}

// Write articles
export async function writeArticles(articles: Article[]): Promise<void> {
  await ensureDataDir();
  const data = JSON.stringify(articles, null, 2);
  await fs.writeFile(ARTICLES_FILE, data, 'utf-8');
}

// Get single article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await readArticles();
  return articles.find(a => a.id === id) || null;
}

// Get single article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await readArticles();
  return articles.find(a => a.slug === slug) || null;
}

// Create article
export async function createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
  const articles = await readArticles();
  
  const newArticle: Article = {
    ...article,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  articles.push(newArticle);
  await writeArticles(articles);
  
  return newArticle;
}

// Update article
export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  const articles = await readArticles();
  const index = articles.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await writeArticles(articles);
  return articles[index];
}

// Delete article
export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await readArticles();
  const filtered = articles.filter(a => a.id !== id);
  
  if (filtered.length === articles.length) return false;
  
  await writeArticles(filtered);
  return true;
}

// Get published articles (for public view)
export async function getPublishedArticles(): Promise<Article[]> {
  const articles = await readArticles();
  return articles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
}

// Generate unique ID
function generateId(): string {
  return `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
