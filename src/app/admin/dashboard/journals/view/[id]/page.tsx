
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import type { JournalCategory as JournalCategoryType } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, ArrowLeft, Pencil, FlaskConical, Library, Briefcase, Scale, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import TiptapRenderer from '@/components/shared/TiptapRenderer';
import Image from 'next/image';
import { toPublicUrl } from '@/lib/urlUtils';
import LoadingViewJournalCategoryPage from './loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JournalCategoryPagesManager from '@/components/admin/JournalCategoryPagesManager';

// --- Icon Mapping ---
const iconMap: { [key: string]: LucideIcon } = {
  FlaskConical,
  Library,
  Briefcase,
  Scale,
};

const DetailItem = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-md text-foreground">{value || 'N/A'}</p>
  </div>
);

export default function ViewJournalCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const activeTab = searchParams.get('tab');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<JournalCategoryType | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);

  const fetchCategory = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/journal-categories/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch category data.');
      }
      const data = await response.json();
      setCategory(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (authToken && id) {
      fetchCategory(authToken);
    }
  }, [authToken, id, fetchCategory]);

  if (isLoading) {
    return <LoadingViewJournalCategoryPage />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle /> Error Loading Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={() => router.back()} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!category || !authToken) {
    return <div>Category not found or you are not authorized.</div>;
  }
  
  const CategoryIcon = category.iconName ? iconMap[category.iconName] || FlaskConical : FlaskConical;

  return (
     <div className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-between items-center">
            <Button asChild variant="outline" size="sm" className="w-fit">
                <Link href="/admin/dashboard/journals">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Journals
                </Link>
            </Button>
            <Button asChild size="sm">
                <Link href={`/admin/dashboard/journals/edit/${id}`}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Category
                </Link>
            </Button>
        </div>
        
        <Tabs defaultValue={activeTab === 'pages' ? 'pages' : 'details'} className="w-full">
            <TabsList className="border bg-muted/50 p-1 h-auto">
                <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                    Journal Details
                </TabsTrigger>
                <TabsTrigger value="pages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                    Manage Pages
                </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
                 <Card>
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <CategoryIcon className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-headline font-bold text-primary">{category.name}</CardTitle>
                                <CardDescription>ID: {category.id}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Separator />
                        {category.imagePath && (
                            <div>
                                <h4 className="text-lg font-semibold text-primary mb-3">Thumbnail</h4>
                                <div className="relative w-full max-w-sm aspect-video rounded-md overflow-hidden border">
                                    <Image
                                        src={toPublicUrl(category.imagePath)}
                                        alt="Category thumbnail"
                                        fill
                                        sizes="(max-width: 640px) 100vw, 33vw"
                                        className="object-cover"
                                        data-ai-hint={category.imageHint || "journal category"}
                                    />
                                </div>
                            </div>
                        )}
                        <Separator />
                        <div>
                            <h4 className="text-lg font-semibold text-primary mb-2">Description</h4>
                            <TiptapRenderer
                                jsonContent={category.description}
                                className="prose prose-sm sm:prose-base max-w-none font-body text-foreground/80"
                            />
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <DetailItem label="Abbreviation" value={category.abbreviation} />
                            <DetailItem label="Language" value={category.language} />
                            <DetailItem label="ISSN" value={category.issn} />
                            <DetailItem label="Display ISSN" value={category.displayIssn} />
                            <DetailItem label="DOI Base" value={category.doiBase} />
                            <DetailItem label="Start Year" value={category.startYear} />
                            <DetailItem label="Copyright Year" value={category.copyrightYear} />
                            <DetailItem label="Header BG Color" value={category.bgColor} />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="pages" className="mt-4">
                 <Card>
                     <CardHeader>
                        <JournalCategoryPagesManager.Title />
                     </CardHeader>
                     <CardContent className="p-6 pt-0">
                        <JournalCategoryPagesManager.Content 
                            journalCategoryId={id} 
                            authToken={authToken} 
                        />
                     </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
