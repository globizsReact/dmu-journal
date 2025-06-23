
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

// Zod schema for validation
const categorySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  iconName: z.string().min(1, 'Icon name is required.'),
  imagePath: z.string().min(1, 'Image path is required.'),
  imageHint: z.string().min(1, 'Image hint is required.'),
  abbreviation: z.string().optional(),
  language: z.string().optional(),
  issn: z.string().optional(),
  doiBase: z.string().optional(),
  startYear: z.number().optional(),
  displayIssn: z.string().optional(),
  copyrightYear: z.number().optional(),
});

function createSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

// GET all journal categories
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const categories = await prisma.journalCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching journal categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new journal category
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validation = categorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }
    
    const { name, ...rest } = validation.data;
    const slug = createSlug(name);
    
    const existingCategoryBySlug = await prisma.journalCategory.findUnique({ where: { slug } });
    if (existingCategoryBySlug) {
        return NextResponse.json({ error: `A category with the generated slug '${slug}' already exists.` }, { status: 409 });
    }

    const newCategory = await prisma.journalCategory.create({
      data: {
        name,
        slug,
        ...rest,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error('Error creating journal category:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return NextResponse.json({ error: 'A category with this name already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
