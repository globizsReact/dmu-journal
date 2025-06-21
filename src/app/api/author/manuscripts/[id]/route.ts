
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';

// GET a single manuscript by ID for the submitting author
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const manuscriptId = params.id;
  console.log(`Author Manuscript API (GET): Received request for manuscript ID: ${manuscriptId}`);

  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Author Manuscript API (GET): Missing token.');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
      console.log('Author Manuscript API (GET): Invalid token or missing user ID.');
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const userId = decodedToken.userId as number;
    console.log(`Author Manuscript API (GET): Authenticated user ID: ${userId}`);

    const manuscript = await prisma.manuscript.findUnique({
      where: { id: manuscriptId },
      include: {
        submittedBy: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!manuscript) {
      console.log(`Author Manuscript API (GET): Manuscript not found with ID: ${manuscriptId}`);
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
    }
    
    // Security Check: Ensure the user requesting the manuscript is the one who submitted it.
    if (manuscript.submittedById !== userId) {
      console.log(`Author Manuscript API (GET): Forbidden. User ${userId} tried to access manuscript ${manuscriptId} owned by ${manuscript.submittedById}.`);
      return NextResponse.json({ error: 'Forbidden: You do not have permission to view this manuscript.' }, { status: 403 });
    }
    
    let parsedManuscript = { ...manuscript };
    // Assuming coAuthors might be stored as a JSON string in the database from form submission
    if (manuscript.coAuthors && typeof manuscript.coAuthors === 'string') {
        try {
            parsedManuscript.coAuthors = JSON.parse(manuscript.coAuthors);
        } catch (e) {
            console.error("Failed to parse coAuthors JSON:", e);
            // keep as is, or handle appropriately
        }
    }


    console.log(`Author Manuscript API (GET): Manuscript ${manuscriptId} fetched successfully for user ${userId}.`);
    return NextResponse.json(parsedManuscript, { status: 200 });

  } catch (error: any) {
    console.error(`Author Manuscript API (GET): General error for ID ${manuscriptId}:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the manuscript.', details: error.message },
      { status: 500 }
    );
  }
}
