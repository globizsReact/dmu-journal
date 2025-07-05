
import type { LucideIcon } from 'lucide-react';
import type { JournalCategory as PrismaJournalCategory, JournalPage as PrismaJournalPage, Manuscript as PrismaManuscript, User as PrismaUser } from '@prisma/client';

export interface JournalCategory extends PrismaJournalCategory {
  publishedArticlesCount?: number;
  icon?: LucideIcon;
  bgColor?: string | null;
}

export interface JournalPage extends PrismaJournalPage {
  children?: JournalPage[];
}

export interface PageWithChildren extends PrismaJournalPage {
  children: PageWithChildren[];
}

export interface ManuscriptDetails extends PrismaManuscript {
  submittedBy?: {
    fullName: string | null;
    email: string | null;
    department: string | null;
    instituteName: string | null;
  } | null;
  coAuthors?: { title: string; givenName: string; lastName: string; email: string; affiliation: string; country: string }[];
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
  imagePath?: string | null; 
  imageHint?: string | null; 
  views?: number;
  downloads?: number;
  citations?: number;
  keywords?: string[] | string;
  articleType?: string;
  thumbnailImagePath?: string | null;
  thumbnailImageHint?: string | null;
}

export interface EditorialBoardMember {
  id: number;
  fullName: string;
  articleNumber: string;
  journalName: string;
  manuscriptTitle: string;
  department?: string | null;
  instituteName?: string | null;
  avatarUrl?: string | null;
}

// --- Types for Author Pages ---
export interface AuthorProfile {
  id: number;
  fullName: string | null;
  username: string;
  avatarUrl: string | null;
  instituteName: string | null;
  department: string | null;
}

export interface AuthorStats {
  totalViews: number;
  totalDownloads: number;
  totalManuscripts: number;
}

export interface ManuscriptData {
  entry: JournalEntry;
  categoryName: string;
}
