
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EditManuscriptPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">Edit Manuscript</CardTitle>
            <CardDescription>This feature is currently under development.</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Construction className="mx-auto h-16 w-16 text-primary/70 mb-4" />
            <p className="text-lg text-muted-foreground">
              The ability to edit submitted manuscripts will be available soon.
            </p>
            <Button asChild className="mt-6">
                <Link href="/author/dashboard">
                    Back to Dashboard
                </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
