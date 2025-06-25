import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const page = await prisma.sitePage.findUnique({
      where: { slug: 'about-us' },
    });

    if (!page) {
      return NextResponse.json(
        { 
          title: 'About Us',
          content: {
            type: 'doc',
            content: [{
              type: 'paragraph',
              content: [{
                type: 'text',
                text: 'Content not available. Please add content in the admin panel.'
              }]
            }]
          }
        }, 
        { status: 200 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching about us page:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
