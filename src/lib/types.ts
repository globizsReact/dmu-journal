
import type { LucideIcon } from 'lucide-react';
import type { JournalCategory as PrismaJournalCategory, JournalPage as PrismaJournalPage } from '@prisma/client';

export interface JournalCategory extends PrismaJournalCategory {
  publishedArticlesCount?: number;
  icon?: LucideIcon;
}

export interface JournalPage extends PrismaJournalPage {
  children?: JournalPage[];
}

export interface JournalEntry {
  id: string; 
  title: string;
  abstract: any; 
  date: string; 
  categoryId: string;
  excerpt: string; 
  authors?: string[] | { name: string }[];
  coAuthors?: { name: string }[]; 
  doiSuffix?: string; 
  imagePath?: string; 
  imageHint?: string; 
  views?: number;
  downloads?: number;
  citations?: number;
  keywords?: string[] | string;
  articleType?: string;
  thumbnailImagePath?: string;
  thumbnailImageHint?: string;
}
