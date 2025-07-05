
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Book, Search } from 'lucide-react';
import Link from 'next/link';
import { toPublicUrl } from '@/lib/urlUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface Author {
  id: number;
  fullName: string | null;
  username: string;
  avatarUrl: string | null;
  instituteName: string | null;
  _count: {
    submittedManuscripts: number;
  };
}

const getInitials = (name: string | null) => {
  if (!name) return 'A';
  const names = name.split(' ');
  return names.map((n) => n[0]).join('').toUpperCase().substring(0, 2);
};

const AuthorCard = ({ author }: { author: Author }) => (
  <Link href={`/authors/${author.id}`}>
    <Card className="h-full text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center p-6">
      <Avatar className="w-24 h-24 mb-4 border-2 border-primary/20">
        <AvatarImage src={toPublicUrl(author.avatarUrl)} alt={author.fullName || author.username} />
        <AvatarFallback className="text-3xl">{getInitials(author.fullName)}</AvatarFallback>
      </Avatar>
      <h3 className="font-semibold text-lg text-primary">{author.fullName || author.username}</h3>
      {author.instituteName && <p className="text-sm text-muted-foreground">{author.instituteName}</p>}
      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
        <Book className="w-3 h-3"/>
        <span>{author._count.submittedManuscripts} Published Manuscripts</span>
      </div>
    </Card>
  </Link>
);


export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);


  useEffect(() => {
    const fetchAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/public/authors?query=${debouncedSearchQuery}`);
        if (!response.ok) throw new Error('Failed to fetch authors');
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthors();
  }, [debouncedSearchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Our Authors</h1>
          <p className="mt-2 text-lg text-muted-foreground">Browse the talented authors contributing to our journals.</p>
        </div>
        <div className="relative max-w-xl mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for an author by name..."
            className="pl-10 h-12 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-1" />
              </div>
            ))}
          </div>
        ) : authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {authors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-16">No authors found for your search.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
