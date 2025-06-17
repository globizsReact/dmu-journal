import type { JournalCategory, JournalEntry } from './types';
import { Globe2, TrendingUp, PenLine, BookOpenText, MountainSnow, Leaf, Coffee, Telescope } from 'lucide-react';

export const journalCategories: JournalCategory[] = [
  {
    id: '1',
    name: 'Wanderlust Tales',
    description: 'Chronicles of adventures from near and far.',
    icon: Globe2,
    slug: 'wanderlust-tales',
    imagePath: 'https://placehold.co/600x400.png',
    imageHint: 'travel map'
  },
  {
    id: '2',
    name: 'Growth Arc',
    description: 'Reflections on personal development and learning.',
    icon: TrendingUp,
    slug: 'growth-arc',
    imagePath: 'https://placehold.co/600x400.png',
    imageHint: 'path mountain'
  },
  {
    id: '3',
    name: 'Inkwell Ideas',
    description: 'A canvas for creative thoughts and fictional stories.',
    icon: PenLine,
    slug: 'inkwell-ideas',
    imagePath: 'https://placehold.co/600x400.png',
    imageHint: 'notebook pen'
  },
  {
    id: '4',
    name: 'Daily Musings',
    description: 'Everyday thoughts, observations, and moments.',
    icon: BookOpenText,
    slug: 'daily-musings',
    imagePath: 'https://placehold.co/600x400.png',
    imageHint: 'diary open'
  },
];

export const journalEntries: JournalEntry[] = [
  // Wanderlust Tales
  {
    id: 'j1',
    title: 'Alpine Adventures',
    content: 'The air was crisp and the view from the summit was breathtaking. Mountains stretched as far as the eye could see, their peaks dusted with fresh snow. We spent an hour just soaking it all in, feeling small against the vastness of nature. The descent was challenging but rewarding, filled with laughter and shared stories.',
    date: '2023-07-15T10:00:00Z',
    categoryId: '1',
    excerpt: 'The air was crisp and the view from the summit was breathtaking...'
  },
  {
    id: 'j2',
    title: 'Coastal Charms',
    content: 'The scent of salt and sea filled our lungs as we strolled along the picturesque coastline. Quaint fishing villages dotted the landscape, their colorful boats bobbing gently in the harbor. We discovered a hidden cove with crystal-clear water, perfect for an afternoon swim.',
    date: '2023-08-22T14:30:00Z',
    categoryId: '1',
    excerpt: 'The scent of salt and sea filled our lungs as we strolled along...'
  },
  // Growth Arc
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
    categoryId: '2',
    excerpt: 'Practicing mindfulness daily has transformed my perspective...'
  },
  // Inkwell Ideas
  {
    id: 'j5',
    title: 'The Clockwork Dragon',
    content: 'In a city powered by steam and gears, a rumor spread of a magnificent clockwork dragon hidden deep within the inventor\'s guild. Elara, a young apprentice, was determined to find it, believing it held the key to saving her ailing father. Her quest would lead her through treacherous cog-filled corridors and into a web of mechanical marvels and dangerous secrets.',
    date: '2023-11-01T20:00:00Z',
    categoryId: '3',
    excerpt: 'In a city powered by steam and gears, a rumor spread of a magnificent...'
  },
  {
    id: 'j6',
    title: 'Whispers in the Woods',
    content: 'The ancient forest was said to be enchanted, its trees whispering secrets to those who dared to listen. A young bard, seeking inspiration for his songs, ventured into its depths. He found not only melodies but also a hidden community of sprites who guarded the forest\'s magic.',
    date: '2023-12-08T11:45:00Z',
    categoryId: '3',
    excerpt: 'The ancient forest was said to be enchanted, its trees whispering secrets...'
  },
  // Daily Musings
  {
    id: 'j7',
    title: 'A Quiet Morning',
    content: 'The gentle hum of the city waking up, a warm cup of coffee, and a few moments of quiet reflection before the day begins. These small rituals bring a sense of peace and preparedness. Today, the sky is a soft blue, promising a beautiful day.',
    date: '2024-01-10T07:30:00Z',
    categoryId: '4',
    excerpt: 'The gentle hum of the city waking up, a warm cup of coffee...'
  },
  {
    id: 'j8',
    title: 'An Unexpected Encounter',
    content: 'While walking in the park, I met an elderly gentleman painting a vibrant watercolor of the duck pond. We struck up a conversation about art, life, and the changing seasons. It was a simple, yet profound interaction that brightened my afternoon.',
    date: '2024-02-03T15:00:00Z',
    categoryId: '4',
    excerpt: 'While walking in the park, I met an elderly gentleman painting...'
  },
  {
    id: 'j9',
    title: 'Zenith of the Journey',
    content: 'Reaching the zenith of any journey, be it physical or metaphorical, brings a unique blend of accomplishment and nostalgia for the path traveled. The view from the top is always different, shaped by the efforts and experiences along the way.',
    date: '2024-03-12T18:00:00Z',
    categoryId: '1',
    excerpt: 'Reaching the zenith of any journey brings a unique blend of accomplishment...'
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
