
'use server';
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const PAGE_SLUG = 'membership';

// GET the 'Membership' page content for public view
export async function GET(request: NextRequest) {
  try {
    const page = await prisma.sitePage.findUnique({ where: { slug: PAGE_SLUG } });
    if (!page) {
      // Provide default content if the page hasn't been created in the admin panel yet
      return NextResponse.json({
          slug: PAGE_SLUG,
          title: 'Membership',
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Information about membership benefits and how to join will be available here soon. Please check back later.',
                  },
                ],
              },
            ],
          },
          coverImagePath: "https://images.pexels.com/photos/5905497/pexels-photo-5905497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          coverImageHint: "library books",
      });
    }
    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching 'Membership' page:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
