
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

const categorySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.any().refine((value) => {
    const text = getPlainTextFromTiptapJson(value);
    return text.length >= 10;
  }, { message: "Description must contain at least 10 characters of text." }),
  iconName: z.string().min(1, 'Icon name is required.'),
  imagePath: z.string().min(1, 'Image path is required.'),
  imageHint: z.string().min(1, 'Image hint is required.'),
  bgColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color code (e.g. #RRGGBB)").optional().or(z.literal('')),
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

async function checkAdminAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') return null;
  return decoded;
}

// GET a single category by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const category = await prisma.journalCategory.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a category by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const validation = categorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const { name, ...rest } = validation.data;
    const slug = createSlug(name);
    
    // Check for potential conflicts before updating
    const existingByName = await prisma.journalCategory.findFirst({ where: { name, NOT: { id } } });
    if (existingByName) return NextResponse.json({ error: 'Another category with this name already exists.' }, { status: 409 });
    
    const existingBySlug = await prisma.journalCategory.findFirst({ where: { slug, NOT: { id } } });
    if (existingBySlug) return NextResponse.json({ error: `Another category with the generated slug '${slug}' already exists.` }, { status: 409 });

    const updatedCategory = await prisma.journalCategory.update({
      where: { id },
      data: { name, slug, ...rest },
    });
    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    console.error("Error updating category:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a category by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const manuscriptCount = await prisma.manuscript.count({
        where: { journalCategoryId: id },
    });
    if (manuscriptCount > 0) {
        return NextResponse.json({ error: 'Cannot delete category with associated manuscripts.' }, { status: 409 });
    }

    await prisma.journalCategory.delete({ where: { id } });
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
