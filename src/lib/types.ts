
import type { LucideIcon } from 'lucide-react';

export interface JournalCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  slug: string;
  imagePath: string; 
  imageHint: string;
  abbreviation?: string;
  language?: string;
  issn?: string; 
  doiBase?: string; 
  startYear?: number;
  publishedArticlesCount?: number;
  scope?: {
    introduction?: string; 
    topics?: string[];
    conclusion?: string;
  };
  displayIssn?: string; 
  copyrightYear?: number; 
}

export interface JournalEntry {
  id: string; 
  title: string;
  content: string; 
  date: string; 
  categoryId: string;
  excerpt: string; 
  authors?: string[] | { name: string }[];
  coAuthors?: { name: string }[]; // Keep this for prisma relation if needed
  doiSuffix?: string; 
  imagePath?: string; 
  imageHint?: string; 
  views?: number;
  downloads?: number;
  citations?: number;
  keywords?: string[] | string;
  articleType?: string; // e.g., "Full Length Research Paper"
}
