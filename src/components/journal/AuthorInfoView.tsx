
'use client';

import React from 'react';
import type { ManuscriptDetails } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Building, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AuthorInfoViewProps {
  authorDetails: ManuscriptDetails;
}

// Local interface for a unified author object
interface DisplayAuthor {
    fullName: string;
    email: string | null;
    affiliation?: string;
    isCorresponding: boolean;
}

const AuthorInfoView: React.FC<AuthorInfoViewProps> = ({ authorDetails }) => {
  const { submittedBy, coAuthors } = authorDetails;

  // Create a unified list of all authors
  const allAuthors: DisplayAuthor[] = [];

  if (submittedBy) {
    const affiliationParts = [submittedBy.department, submittedBy.instituteName].filter(Boolean);
    allAuthors.push({
      fullName: submittedBy.fullName || 'Unknown Author',
      email: submittedBy.email,
      affiliation: affiliationParts.join(', ') || undefined,
      isCorresponding: true,
    });
  }

  if (coAuthors && coAuthors.length > 0) {
    coAuthors.forEach(author => {
      const affiliationParts = [author.affiliation, author.country].filter(Boolean);
      allAuthors.push({
        fullName: `${author.title} ${author.givenName} ${author.lastName}`,
        email: author.email,
        affiliation: affiliationParts.join(', ') || undefined,
        isCorresponding: false,
      });
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-headline font-semibold text-primary mb-3">Authors Information</h2>
      <Separator className="mb-4" />

      {allAuthors.length > 0 ? (
        <div className="space-y-4">
          {allAuthors.map((author, index) => (
            <Card key={index} className="bg-card">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                    <p className="font-semibold text-foreground text-md">{author.fullName}</p>
                    {author.isCorresponding && (
                        <Badge variant="secondary" className="border-primary text-primary bg-primary/10 whitespace-nowrap">
                            <Star className="w-3.5 h-3.5 mr-1.5"/>
                            Submitting Author
                        </Badge>
                    )}
                </div>
                <div className="mt-2 space-y-1">
                  {author.email && (
                     <p className="text-sm text-muted-foreground flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        <a href={`mailto:${author.email}`} className="hover:underline">{author.email}</a>
                    </p>
                  )}
                  {author.affiliation && (
                    <p className="text-sm text-muted-foreground flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        {author.affiliation}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Author information is not available for this article.</p>
      )}
    </div>
  );
};

export default AuthorInfoView;
