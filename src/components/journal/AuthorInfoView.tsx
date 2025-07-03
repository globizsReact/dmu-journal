
'use client';

import React from 'react';
import type { ManuscriptDetails } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Building } from 'lucide-react';

interface AuthorInfoViewProps {
  authorDetails: ManuscriptDetails;
}

const AuthorInfoView: React.FC<AuthorInfoViewProps> = ({ authorDetails }) => {
  const { submittedBy, coAuthors } = authorDetails;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-headline font-semibold text-primary mb-3">Authors Information</h2>
      <Separator className="mb-4" />

      {submittedBy && (
        <Card className="bg-card border-l-4 border-primary">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Corresponding Author</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-foreground text-md">{submittedBy.fullName}</p>
            {submittedBy.email && (
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" />
                <a href={`mailto:${submittedBy.email}`} className="hover:underline">{submittedBy.email}</a>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {coAuthors && coAuthors.length > 0 && (
        <div className="space-y-4">
            <h3 className="text-lg font-headline text-primary mt-6">Co-Authors</h3>
            {coAuthors.map((author, index) => (
                <Card key={index} className="bg-card">
                    <CardContent className="pt-6">
                        <p className="font-semibold text-foreground text-md">{author.title} {author.givenName} {author.lastName}</p>
                        <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            <a href={`mailto:${author.email}`} className="hover:underline">{author.email}</a>
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                            <Building className="w-4 h-4 mr-2" />
                            {author.affiliation} ({author.country})
                        </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}

      {!submittedBy && (!coAuthors || coAuthors.length === 0) && (
          <p className="text-muted-foreground">Author information is not available for this article.</p>
      )}
    </div>
  );
};

export default AuthorInfoView;
