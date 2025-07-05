
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Book, Loader2, AlertTriangle, University } from 'lucide-react';
import { toPublicUrl } from '@/lib/urlUtils';
import LoadingAuthorDetailPage from './loading';
import ArticleListItemCard from '@/components/category/ArticleListItemCard';
import type { AuthorProfile, AuthorStats, ManuscriptData } from '@/lib/types';


interface AuthorData {
  author: AuthorProfile;
  stats: AuthorStats;
  manuscripts: ManuscriptData[];
}

const getInitials = (name: string | null) => {
  if (!name) return 'A';
  const names = name.split(' ');
  return names.map((n) => n[0]).join('').toUpperCase().substring(0, 2);
};

export default function AuthorDetailPage() {
  const params = useParams();
  const authorId = params.id as string;
  const [authorData, setAuthorData] = useState<AuthorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authorId) return;
    const fetchAuthorData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/public/authors/${authorId}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to fetch author data');
        }
        const data: AuthorData = await response.json();
        setAuthorData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuthorData();
  }, [authorId]);

  if (isLoading) {
    return <LoadingAuthorDetailPage />;
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/20">
        <Header />
        <main className="flex-1 container mx-auto flex items-center justify-center">
          <div className="text-center bg-card p-8 rounded-lg shadow-md">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-destructive">An Error Occurred</h1>
            <p className="text-muted-foreground mt-2">{error}</p>
            <Button asChild className="mt-6">
              <Link href="/authors">Back to Authors List</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!authorData) {
    return <div>Author not found.</div>;
  }

  const { author, stats, manuscripts } = authorData;

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Author Profile Card */}
          <aside className="w-full md:w-1/3 lg:w-1/4 md:sticky md:top-8">
            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <Avatar className="h-32 w-32 rounded-full mb-4 mx-auto border-4 border-primary/20">
                  <AvatarImage src={toPublicUrl(author.avatarUrl)} alt={author.fullName || author.username} />
                  <AvatarFallback className="text-5xl">{getInitials(author.fullName)}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold text-primary">{author.fullName || author.username}</h1>
                {author.instituteName && (
                  <p className="text-md text-muted-foreground mt-1 flex items-center justify-center gap-2">
                    <University className="w-4 h-4" />
                    {author.instituteName}
                  </p>
                )}
                 {author.department && <p className="text-sm text-muted-foreground">{author.department}</p>}
                
                <Separator className="my-4" />
                
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.totalManuscripts}</p>
                    <p className="text-xs text-muted-foreground">Manuscripts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.totalViews}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.totalDownloads}</p>
                    <p className="text-xs text-muted-foreground">Downloads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Manuscripts List */}
          <section className="w-full md:w-2/3 lg:w-3/4">
            <h2 className="text-3xl font-headline font-bold text-primary mb-6">Published Manuscripts</h2>
            {manuscripts.length > 0 ? (
              <div className="space-y-6">
                {manuscripts.map((msData) => (
                  <ArticleListItemCard
                    key={msData.entry.id}
                    entry={msData.entry}
                    categoryName={msData.categoryName}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground mt-16 bg-card p-8 rounded-lg shadow-sm">
                This author has no published manuscripts yet.
              </p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
