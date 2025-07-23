
'use server';
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const PAGE_SLUG = 'support-center';

// GET the 'Support Center' page content for public view
export async function GET(request: NextRequest) {
  try {
    const page = await prisma.sitePage.findUnique({ where: { slug: PAGE_SLUG } });
    if (!page) {
      // Provide default content if the page hasn't been created in the admin panel yet
      return NextResponse.json({
          slug: PAGE_SLUG,
          title: 'Support Center',
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Contact information and support resources will be available here soon. Please check back later.',
                  },
                ],
              },
            ],
          },
          coverImagePath: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          coverImageHint: "team meeting collaboration",
      });
    }
    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching 'Support Center' page:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
