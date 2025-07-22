
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const twelveMonthsAgo = subMonths(new Date(), 11);
    const startDate = startOfMonth(twelveMonthsAgo);

    const submissions = await prisma.manuscript.groupBy({
      by: ['submittedAt'],
      _count: {
        submittedAt: true,
      },
      where: {
        submittedAt: {
          gte: startDate,
        },
      },
      orderBy: {
        submittedAt: 'asc',
      },
    });

    const monthlyCounts: { [key: string]: number } = {};

    // Initialize all months in the last year to 0
    for (let i = 0; i < 12; i++) {
        const monthDate = subMonths(new Date(), i);
        const monthKey = format(monthDate, 'MMM yy');
        monthlyCounts[monthKey] = 0;
    }
    
    // Populate counts from the database
    submissions.forEach(submission => {
        const monthKey = format(new Date(submission.submittedAt), 'MMM yy');
        if(monthlyCounts.hasOwnProperty(monthKey)) {
            monthlyCounts[monthKey] += submission._count.submittedAt;
        }
    });

    // Convert to sorted array for the chart
    const chartData = Object.entries(monthlyCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(`01 ${a.date.split(' ')[0]} 20${a.date.split(' ')[1]}`) .getTime() - new Date(`01 ${b.date.split(' ')[0]} 20${b.date.split(' ')[1]}`).getTime());


    return NextResponse.json(chartData, { status: 200 });

  } catch (error: any) {
    console.error('Admin Stats API (Submissions Over Time): General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching time-series data.', details: error.message },
      { status: 500 }
    );
  }
}
