import type { JournalCategory, JournalEntry } from './types';
import { FlaskConical, Library, Briefcase, Scale, Globe2, TrendingUp, PenLine, BookOpenText } from 'lucide-react';

export const journalCategories: JournalCategory[] = [
  {
    id: '1',
    name: 'Journal Of Sciences',
    description: 'Exploring scientific discoveries and innovations.',
    icon: FlaskConical,
    slug: 'journal-of-sciences',
    imagePath: 'https://placehold.co/400x300.png',
    imageHint: 'molecules science'
  },
  {
    id: '2',
    name: 'Journal Of Humanities And Social Sciences',
    description: 'Insights into culture, society, and human behavior.',
    icon: Library,
    slug: 'journal-of-humanities-and-social-sciences',
    imagePath: 'https://placehold.co/400x300.png',
    imageHint: 'library books'
  },
  {
    id: '3',
    name: 'Journal Of Business & Applied Research',
    description: 'Advancing business practices and applied research.',
    icon: Briefcase,
    slug: 'journal-of-business-and-applied-research',
    imagePath: 'https://placehold.co/400x300.png',
    imageHint: 'graphs business'
  },
  {
    id: '4',
    name: 'Journal Of Legal Studies',
    description: 'Critical analysis of law and legal systems.',
    icon: Scale,
    slug: 'journal-of-legal-studies',
    imagePath: 'https://placehold.co/400x300.png',
    imageHint: 'gavel law'
  },
];

// Keeping existing example entries, they might need re-categorization or removal later
export const journalEntries: JournalEntry[] = [
  {
    id: 'j1',
    title: 'Alpine Adventures',
    content: 'The air was crisp and the view from the summit was breathtaking. Mountains stretched as far as the eye could see, their peaks dusted with fresh snow. We spent an hour just soaking it all in, feeling small against the vastness of nature. The descent was challenging but rewarding, filled with laughter and shared stories.',
    date: '2023-07-15T10:00:00Z',
    categoryId: '1', // Example: mapping to new "Journal of Sciences" if appropriate, or a general category
    excerpt: 'The air was crisp and the view from the summit was breathtaking...'
  },
  {
    id: 'j2',
    title: 'Coastal Charms',
    content: 'The scent of salt and sea filled our lungs as we strolled along the picturesque coastline. Quaint fishing villages dotted the landscape, their colorful boats bobbing gently in the harbor. We discovered a hidden cove with crystal-clear water, perfect for an afternoon swim.',
    date: '2023-08-22T14:30:00Z',
    categoryId: '2', // Example: mapping to "Journal of Humanities"
    excerpt: 'The scent of salt and sea filled our lungs as we strolled along...'
  },
  {
    id: 'j3',
    title: 'Learning a New Language',
    content: 'Embarking on the journey of learning Spanish has been both challenging and incredibly rewarding. Each new word and grammatical rule unlocked feels like a small victory. Conversations, however broken, are starting to flow, opening up a new world of connection.',
    date: '2023-09-05T09:15:00Z',
    categoryId: '2',
    excerpt: 'Embarking on the journey of learning Spanish has been both challenging...'
  },
  {
    id: 'j4',
    title: 'Mastering Mindfulness',
    content: 'Practicing mindfulness daily has transformed my perspective. Taking just ten minutes to focus on my breath and be present in the moment has reduced stress and increased my appreciation for the small things in life. It\'s an ongoing practice, but the benefits are undeniable.',
    date: '2023-10-11T17:00:00Z',
    categoryId: '3', // Example: mapping to "Journal of Business & Applied Research" if it's about productivity
    excerpt: 'Practicing mindfulness daily has transformed my perspective...'
  },
];

export const getCategoryBySlug = (slug: string): JournalCategory | undefined => {
  return journalCategories.find(category => category.slug === slug);
}

export const getJournalsByCategoryId = (categoryId: string): JournalEntry[] => {
  return journalEntries.filter(entry => entry.categoryId === categoryId);
}

export const getJournalById = (id: string): JournalEntry | undefined => {
  return journalEntries.find(entry => entry.id === id);
}
