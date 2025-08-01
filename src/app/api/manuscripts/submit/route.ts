
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import type { ManuscriptDetailsData } from '@/components/author/forms/ManuscriptDetailsForm';
import type { AuthorDetailsData } from '@/components/author/forms/AuthorDetailsForm';

// Define the expected shape of the request body
interface SubmissionPayload {
  manuscriptDetails: ManuscriptDetailsData;
  authorDetails: AuthorDetailsData;
  files: {
    coverLetterImagePath?: string;
    coverLetterImageHint?: string;
    manuscriptFileUrl: string;
    supplementaryFileUrl?: string;
    agreedToTerms: boolean;
  };
}

export async function POST(request: NextRequest) {
  console.log('Manuscript Submission API: Received request');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Manuscript Submission API: Missing token');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
      console.log('Manuscript Submission API: Invalid token');
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const userId = decodedToken.userId as number;
    console.log(`Manuscript Submission API: Authenticated user ID: ${userId}`);

    const body: SubmissionPayload = await request.json();
    console.log('Manuscript Submission API: Request body:', JSON.stringify(body, null, 2));

    const { manuscriptDetails, authorDetails, files } = body;

    if (!manuscriptDetails || !authorDetails || !files) {
      console.log('Manuscript Submission API: Missing required payload sections');
      return NextResponse.json({ error: 'Invalid submission data: Missing required sections.' }, { status: 400 });
    }
    
    if (!files.manuscriptFileUrl) {
        console.log('Manuscript Submission API: Missing manuscript file URL');
        return NextResponse.json({ error: 'Manuscript file is required.' }, { status: 400 });
    }
    if (!files.agreedToTerms) {
        console.log('Manuscript Submission API: Author agreement not acknowledged');
        return NextResponse.json({ error: 'Author agreement must be acknowledged.' }, { status: 400 });
    }


    console.log('Manuscript Submission API: Creating manuscript in database...');
    const newManuscript = await prisma.manuscript.create({
      data: {
        articleTitle: manuscriptDetails.articleTitle,
        abstract: manuscriptDetails.abstract,
        keywords: manuscriptDetails.keywords,
        journalCategoryId: manuscriptDetails.journalId,
        isSpecialReview: manuscriptDetails.isSpecialReview || false,
        
        // Storing URLs in the ...FileName fields
        coverLetterFileName: files.coverLetterImagePath, 
        manuscriptFileName: files.manuscriptFileUrl,
        supplementaryFilesName: files.supplementaryFileUrl,
        
        // Re-using thumbnail fields for the main manuscript image (cover letter)
        thumbnailImagePath: files.coverLetterImagePath,
        thumbnailImageHint: files.coverLetterImageHint,
        
        authorAgreement: files.agreedToTerms,
        coAuthors: authorDetails.authors, // Prisma will store this as JSON
        
        status: 'Submitted', // Initial status
        submittedById: userId,
      },
    });
    console.log('Manuscript Submission API: Manuscript created successfully:', newManuscript);

    return NextResponse.json(
      {
        message: 'Manuscript submitted successfully.',
        manuscriptId: newManuscript.id,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Manuscript Submission API: General error:', error);
    if (error instanceof SyntaxError) {
        console.log('Manuscript Submission API: Invalid request body (SyntaxError).');
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    if (error.code === 'P2002') { // Prisma unique constraint violation (if any were defined beyond PK)
        console.log('Manuscript Submission API: Prisma unique constraint violation (P2002).');
        return NextResponse.json({ error: 'A record with this identifier already exists.' }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred during manuscript submission.', details: error.message },
      { status: 500 }
    );
  }
}
