
import type { LucideIcon } from 'lucide-react';
import type { JournalCategory as PrismaJournalCategory } from '@prisma/client';

export interface JournalCategory extends PrismaJournalCategory {
  publishedArticlesCount?: number; // This can be added dynamically
  icon?: LucideIcon; // This can be added dynamically
}

export interface JournalEntry {
  id: string; 
  title: string;
  abstract: any; // Changed from content: string to abstract: any
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
  thumbnailImagePath?: string;
  thumbnailImageHint?: string;
}
