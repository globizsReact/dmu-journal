
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';

interface SearchSuggestion {
    id: string;
    title: string;
    excerpt: string;
    authors: string[];
}

const GlobalSearchInput = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetSearch = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim().length > 1) {
        const fetchSuggestions = async () => {
          setIsLoading(true);
          try {
            const response = await fetch(`/api/public/manuscripts/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSuggestions(data.suggestions || []);
            setShowSuggestions(true);
          } catch (error) {
            console.error("Failed to fetch search suggestions:", error);
            setSuggestions([]);
            setShowSuggestions(true); 
          } finally {
            setIsLoading(false);
          }
        };
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
      }
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(-1); 
  };

  const handleSuggestionClick = (suggestionId: string) => {
    router.push(`/journal/${suggestionId}`);
    resetSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSuggestionClick(suggestions[activeIndex].id);
        } else if (suggestions.length > 0) {
          handleSuggestionClick(suggestions[0].id);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    }
  };

  useEffect(() => {
    if (activeIndex !== -1 && showSuggestions) {
      const suggestionElement = document.getElementById(`suggestion-${activeIndex}`);
      suggestionElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, showSuggestions]);

  return (
    <div className="relative w-full md:w-auto md:max-w-sm" ref={searchContainerRef}>
      {isLoading ? (
        <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 animate-spin" />
      ) : (
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 pointer-events-none" />
      )}
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search Articles..."
        value={query}
        onChange={handleInputChange}
        onFocus={() => query.trim().length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        className="pl-10 pr-4 py-2 w-full"
        aria-label="Search articles by title, excerpt, or author"
        aria-autocomplete="list"
        aria-expanded={showSuggestions && suggestions.length > 0}
        aria-controls="suggestions-listbox"
        aria-activedescendant={activeIndex !== -1 ? `suggestion-${activeIndex}` : undefined}
      />
      {showSuggestions && !isLoading && (
        <Card
          className="absolute top-full mt-1.5 w-full max-h-96 overflow-y-auto shadow-lg z-50 bg-card border border-border"
          role="listbox"
          id="suggestions-listbox"
        >
          <CardContent className="p-0">
            {suggestions.length > 0 ? (
              <ul className="divide-y divide-border">
                {suggestions.map((entry, index) => (
                  <li
                    key={entry.id}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={activeIndex === index}
                    className={`
                      ${activeIndex === index ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}
                      cursor-pointer
                    `}
                    onClick={() => handleSuggestionClick(entry.id)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <div className="block p-3 transition-colors">
                      <h4 className={`text-sm font-medium ${activeIndex === index ? 'text-accent-foreground' : 'text-primary'}`}>
                        {entry.title}
                      </h4>
                      <p className={`text-xs truncate ${activeIndex === index ? 'text-accent-foreground/80' : 'text-muted-foreground'}`}>
                        {entry.excerpt}
                      </p>
                      {entry.authors && entry.authors.length > 0 && (
                        <p className={`text-xs italic mt-0.5 ${activeIndex === index ? 'text-accent-foreground/70' : 'text-muted-foreground/80'}`}>
                          By: {entry.authors.join(', ')}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              query.trim().length > 1 && (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    No articles found for &quot;{query}&quot;.
                  </p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearchInput;
