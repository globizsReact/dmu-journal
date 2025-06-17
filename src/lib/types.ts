import type { LucideIcon } from 'lucide-react';

export interface JournalCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  slug: string;
  imagePath: string; // Main image for the category (e.g., on landing page)
  imageHint: string;
  // New fields for category details page
  abbreviation?: string;
  language?: string;
  issn?: string; // Journal specific ISSN
  doiBase?: string; 
  startYear?: number;
  publishedArticlesCount?: number;
  scope?: {
    introduction?: string; // Overrides general description if provided
    topics?: string[];
    conclusion?: string;
  };
  // Fields from image for the bottom part of category page
  displayIssn?: string; // e.g. "ISSN NO. E: 0973-9262"
  copyrightYear?: number; // e.g. 2018
}

export interface JournalEntry {
  id: string; // Will be used as part of "Article Number - XYZ"
  title: string;
  content: string; // Full content for the individual journal entry page
  date: string; // Store as ISO string, format on display
  categoryId: string;
  excerpt: string; // Short summary for list views
  authors?: string[]; // Optional: list of authors for the entry
  doiSuffix?: string; // To combine with category.doiBase
  imagePath?: string; // Optional: specific image for this entry in a list
  imageHint?: string; // Optional: hint for the entry's specific image
}
