
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

const statusUpdateSchema = z.object({
  status: z.enum(['In Review', 'Accepted', 'Suspended', 'Published']),
});

// GET a single manuscript by ID for a reviewer
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const manuscriptId = params.id;
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const decodedToken = verifyToken(token);
    // Allow reviewer or admin to access this endpoint
    if (!decodedToken || !['reviewer', 'admin'].includes(decodedToken.role || '')) {
      return NextResponse.json({ error: 'Forbidden: Reviewer or admin access required' }, { status: 403 });
    }

    const manuscript = await prisma.manuscript.findUnique({
      where: { id: manuscriptId },
      include: { submittedBy: { select: { fullName: true, email: true } } },
    });

    if (!manuscript) {
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
    }
    
    let parsedManuscript = { ...manuscript };
    if (manuscript.coAuthors && typeof manuscript.coAuthors === 'string') {
        try {
            parsedManuscript.coAuthors = JSON.parse(manuscript.coAuthors);
        } catch (e) {
            console.error("Failed to parse coAuthors JSON:", e);
        }
    }

    return NextResponse.json(parsedManuscript, { status: 200 });

  } catch (error: any) {
    console.error(`Reviewer Manuscript API (GET /${manuscriptId}): General error:`, error);
    return NextResponse.json({ error: 'An unexpected error occurred.', details: error.message }, { status: 500 });
  }
}

// PUT (update) a manuscript's status by ID by a reviewer
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const manuscriptId = params.id;
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken || !['reviewer', 'admin'].includes(decodedToken.role || '')) {
      return NextResponse.json({ error: 'Forbidden: Reviewer or admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const validation = statusUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input data.', issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { status } = validation.data;

    const updatedManuscript = await prisma.manuscript.update({
      where: { id: manuscriptId },
      data: { status },
      include: { submittedBy: { select: { fullName: true, email: true } } },
    });
    
    let parsedUpdatedManuscript = { ...updatedManuscript };
    if (updatedManuscript.coAuthors && typeof updatedManuscript.coAuthors === 'string') {
        try {
            parsedUpdatedManuscript.coAuthors = JSON.parse(updatedManuscript.coAuthors);
        } catch (e) {
            console.error("Failed to parse coAuthors for updated manuscript:", e);
        }
    }
    
    return NextResponse.json(parsedUpdatedManuscript, { status: 200 });

  } catch (error: any) {
     console.error(`Reviewer Manuscript API (PUT /${manuscriptId}): General error:`, error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Manuscript not found for update' }, { status: 404 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.', details: error.message }, { status: 500 });
  }
}
