
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

const manuscriptStatusUpdateSchema = z.object({
  status: z.enum(['Submitted', 'In Review', 'Accepted', 'Published', 'Suspended']),
});

// GET a single manuscript by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const manuscriptId = params.id;
  console.log(`Admin Manuscript API (GET): Received request for manuscript ID: ${manuscriptId}`);

  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Admin Manuscript API (GET): Missing token.');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') {
      console.log('Admin Manuscript API (GET): Invalid token or unauthorized role.');
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    console.log(`Admin Manuscript API (GET): Authenticated admin user ID: ${decodedToken.userId}`);

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
      console.log(`Admin Manuscript API (GET): Manuscript not found with ID: ${manuscriptId}`);
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
    }
    
    // Prisma stores JSON as `JsonValue`, we need to parse it if it's a string for coAuthors
    // Assuming coAuthors is stored as a JSON string in the database
    let parsedManuscript = { ...manuscript };
    if (manuscript.coAuthors && typeof manuscript.coAuthors === 'string') {
        try {
            parsedManuscript.coAuthors = JSON.parse(manuscript.coAuthors);
        } catch (e) {
            console.error("Failed to parse coAuthors JSON:", e);
            // Keep coAuthors as is or handle error appropriately
        }
    }


    console.log(`Admin Manuscript API (GET): Manuscript ${manuscriptId} fetched successfully.`);
    return NextResponse.json(parsedManuscript, { status: 200 });

  } catch (error: any) {
    console.error(`Admin Manuscript API (GET): General error for ID ${manuscriptId}:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the manuscript.', details: error.message },
      { status: 500 }
    );
  }
}


// PUT (update) a manuscript's status by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const manuscriptId = params.id;
  console.log(`Admin Manuscript API (PUT): Received request to update manuscript ID: ${manuscriptId}`);

  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Admin Manuscript API (PUT): Missing token.');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') {
      console.log('Admin Manuscript API (PUT): Invalid token or unauthorized role.');
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    console.log(`Admin Manuscript API (PUT): Authenticated admin user ID: ${decodedToken.userId}`);

    const body = await request.json();
    const validation = manuscriptStatusUpdateSchema.safeParse(body);

    if (!validation.success) {
      console.log('Admin Manuscript API (PUT): Validation failed', validation.error.flatten().fieldErrors);
      return NextResponse.json({ error: 'Invalid input data.', issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { status } = validation.data;

    const updatedManuscript = await prisma.manuscript.update({
      where: { id: manuscriptId },
      data: { status },
       include: { // Include submittedBy and parse coAuthors again for the response
        submittedBy: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
    
    let parsedUpdatedManuscript = { ...updatedManuscript };
    if (updatedManuscript.coAuthors && typeof updatedManuscript.coAuthors === 'string') {
        try {
            parsedUpdatedManuscript.coAuthors = JSON.parse(updatedManuscript.coAuthors);
        } catch (e) {
            console.error("Failed to parse coAuthors JSON for updated manuscript:", e);
        }
    }


    console.log(`Admin Manuscript API (PUT): Manuscript ${manuscriptId} status updated to ${status}.`);
    return NextResponse.json(parsedUpdatedManuscript, { status: 200 });

  } catch (error: any) {
    console.error(`Admin Manuscript API (PUT): General error for ID ${manuscriptId}:`, error);
    if (error.code === 'P2025') { // Prisma error for record not found to update
      console.log(`Admin Manuscript API (PUT): Manuscript not found with ID: ${manuscriptId} for update.`);
      return NextResponse.json({ error: 'Manuscript not found for update' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating the manuscript status.', details: error.message },
      { status: 500 }
    );
  }
}
