import type { LucideIcon } from 'lucide-react';

export interface JournalCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  slug: string;
  imagePath: string;
  imageHint: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // Store as ISO string, format on display
  categoryId: string;
  excerpt: string;
}
