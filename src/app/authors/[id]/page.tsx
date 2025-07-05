
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ArrowRight, Book, Download, Eye, Loader2, AlertTriangle, University } from 'lucide-react';
import { toPublicUrl } from '@/lib/urlUtils';
import LoadingAuthorDetailPage from './loading';
import Image from 'next/image';

interface AuthorProfile {
  id: number;
  fullName: string | null;
  username: string;
  avatarUrl: string | null;
  instituteName: string | null;
  department: string | null;
}

interface AuthorStats {
  totalViews: number;
  totalDownloads: number;
  totalManuscripts: number;
}

interface Manuscript {
  id: string;
  articleTitle: string;
  excerpt: string;
  submittedAt: string;
  thumbnailImagePath: string | null;
  thumbnailImageHint: string | null;
  journalCategory: {
    name: string;
  };
}

interface AuthorData {
  author: AuthorProfile;
  stats: AuthorStats;
  manuscripts: Manuscript[];
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
                {manuscripts.map((ms) => (
                   <Card key={ms.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex flex-col sm:flex-row gap-6">
                        <div className="relative w-full sm:w-48 flex-shrink-0 aspect-video sm:aspect-[4/3] rounded-md overflow-hidden bg-muted">
                            <Image
                                src={toPublicUrl(ms.thumbnailImagePath) || 'https://placehold.co/200x150.png'}
                                alt={ms.articleTitle}
                                fill
                                sizes="(max-width: 640px) 100vw, 25vw"
                                className="object-cover"
                                data-ai-hint={ms.thumbnailImageHint || "journal article"}
                            />
                        </div>
                        <div className="flex-grow flex flex-col">
                            <CardTitle className="text-xl text-primary hover:text-primary/80 mb-1">
                                <Link href={`/journal/${ms.id}`}>{ms.articleTitle}</Link>
                            </CardTitle>
                            <CardDescription className="text-xs mb-2">
                                Published in "{ms.journalCategory.name}" on {new Date(ms.submittedAt).toLocaleDateString()}
                            </CardDescription>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-2 flex-grow">{ms.excerpt}</p>
                            <Button asChild variant="link" className="p-0 mt-auto self-start">
                                <Link href={`/journal/${ms.id}`} className="inline-flex items-center">
                                    Read More <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
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
