"use client";

import { Button } from '@/components/ui/button';

interface AlphabetFilterProps {
  selectedLetter: string | null;
  onSelectLetter: (letter: string | null) => void;
}

const AlphabetFilter = ({ selectedLetter, onSelectLetter }: AlphabetFilterProps) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8 p-4 bg-muted/50 rounded-lg shadow">
      <Button
        variant={selectedLetter === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelectLetter(null)}
        className={`transition-all duration-200 ${selectedLetter === null ? 'bg-primary text-primary-foreground scale-110' : 'hover:bg-accent/20'}`}
        aria-pressed={selectedLetter === null}
      >
        All
      </Button>
      {alphabet.map((letter) => (
        <Button
          key={letter}
          variant={selectedLetter === letter ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectLetter(letter)}
          className={`transition-all duration-200 ${selectedLetter === letter ? 'bg-primary text-primary-foreground scale-110' : 'hover:bg-accent/20'}`}
          aria-pressed={selectedLetter === letter}
          aria-label={`Filter by letter ${letter}`}
        >
          {letter}
        </Button>
      ))}
    </div>
  );
};

export default AlphabetFilter;
