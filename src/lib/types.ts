
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
  authors?: string[]; 
  doiSuffix?: string; 
  imagePath?: string; 
  imageHint?: string; 
}

