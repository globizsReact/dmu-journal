
import type { JournalEntry } from './types';

// The journalCategories data is now in the database.
// This file is now only for static/mock data that hasn't been migrated to the DB yet.

export const journalEntries: JournalEntry[] = [
  {
    id: 'CF00B3673110',
    title: 'Data-Driven Decision Making In Modern Enterprises', // Updated to match image
    content: 'Silver cyprinid (Rastrineobola argentea) fish, locally known as Omena, is an important source of dietary proteins for low-income households in Kenya. The fish is characterized by high postharvest losses chiefly due to improper drying techniques, low-value addition, and poor marketing or distribution channels. The high postharvest loss has implications for the food security and livelihoods of the fisherfolk. Thus, there is a need for studies to provide crucial insights into the current postharvest practices and associated challenges faced by fish value chain actors in Kenya.\n\nA baseline study was conducted on four Omena landing beaches of Kenya\'s Lake Victoria as part of an EU-funded project. The objective of the baseline study was to assess the status of value addition and marketing of silver cyprinid. The findings of the study highlight the need for improved drying, storage, and processing techniques to enhance the quality and marketability of Omena. It also underscores the importance of capacity building, market linkages, quality assurance, and policy support to transform the Omena value chain. By addressing these challenges through innovative technologies and practices, the sector can significantly contribute to food security, livelihoods, and economic growth in the riparian communities of Lake Victoria.',
    date: '2023-07-15T10:00:00Z',
    categoryId: '3', // This will need to match a DB ID after migration
    excerpt: 'Silver cyprinid (Rastrineobola argentea) fish, locally known as Omena, is an important source of dietary proteins for low-income households in Kenya. The fish is characterized by high postharvest losses chiefly due to improper drying techniques, low-value addition, and poor marketing or distribution channels. The high...',
    authors: ['Dr. Jane Doe', 'Dr. John Smith'],
    imagePath: '/images/j1.png', 
    imageHint: 'data charts',
    views: 45,
    downloads: 5,
    citations: 2,
    keywords: ['Silver Cyprinid (Omena)', 'value addition', 'postharvest loss', 'marketing', 'food security'],
    articleType: 'Full Length Research Paper',
  },
  {
    id: 'CF00B3673111',
    title: 'Impact of Social Media on Political Discourse',
    content: 'This paper explores the multifaceted impact of social media platforms on contemporary political discourse. It examines how platforms like Twitter, Facebook, and Instagram have reshaped political campaigning, citizen engagement, and the spread of information (and misinformation). The study employs a mixed-methods approach, combining content analysis of social media data with surveys and interviews of political actors and citizens. Findings indicate that while social media offers unprecedented opportunities for direct communication and mobilization, it also contributes to political polarization, the proliferation of "echo chambers," and challenges to traditional media gatekeepers. The paper concludes with a discussion of policy implications and recommendations for fostering a healthier online political environment.',
    date: '2023-08-22T14:30:00Z',
    categoryId: '2',
    excerpt: 'This paper explores the multifaceted impact of social media platforms on contemporary political discourse. It examines how platforms like Twitter, Facebook, and Instagram have reshaped political campaigning...',
    authors: ['Dr. Alice Brown'],
    imagePath: '/images/j3.png',
    imageHint: 'social analysis',
    views: 220,
    downloads: 45,
    citations: 22,
    keywords: ['social media', 'politics', 'discourse analysis', 'misinformation'],
    articleType: 'Review Article',
  },
];

// Helper functions that used static data are no longer needed here.
// They will be replaced by API calls or direct DB queries in components.
