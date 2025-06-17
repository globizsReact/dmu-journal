"use client";

import type { JournalEntry } from '@/lib/types';
import JournalCard from './JournalCard';
import { AnimatePresence, motion } from 'framer-motion';


interface JournalListProps {
  entries: JournalEntry[];
  filterLetter: string | null;
}

const JournalList = ({ entries, filterLetter }: JournalListProps) => {
  const filteredEntries = filterLetter
    ? entries.filter(entry => entry.title.toUpperCase().startsWith(filterLetter))
    : entries;

  if (filteredEntries.length === 0) {
    return <p className="text-center text-muted-foreground py-8 text-lg">No journals found for this filter.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence>
        {filteredEntries.map((entry, index) => (
           <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <JournalCard entry={entry} animationDelay={`${index * 0.1}s`} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default JournalList;
