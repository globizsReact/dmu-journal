'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Clock, CheckSquare } from 'lucide-react';

interface ReviewerStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  colorClass?: string;
}

const ReviewerStatCard: React.FC<ReviewerStatCardProps> = ({ title, value, icon: Icon, description, colorClass = "text-primary" }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

export default function ReviewerDashboardPage() {
  // Since we cannot fetch real data without schema changes, we'll use placeholder data.
  const placeholderStats = {
    totalAssigned: 12,
    pendingReviews: 3,
    completedReviews: 9,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">Reviewer Dashboard</CardTitle>
          <CardDescription>Welcome! Here you can manage your assigned reviews.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Monitor your review tasks and access manuscripts assigned to you for peer review.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ReviewerStatCard 
          title="Total Assigned Manuscripts" 
          value={placeholderStats.totalAssigned} 
          icon={FileText}
          description="All manuscripts assigned to you."
          colorClass="text-blue-500"
        />
        <ReviewerStatCard 
          title="Pending Reviews" 
          value={placeholderStats.pendingReviews} 
          icon={Clock}
          description="Manuscripts awaiting your review."
          colorClass="text-orange-500"
        />
        <ReviewerStatCard 
          title="Completed Reviews" 
          value={placeholderStats.completedReviews} 
          icon={CheckSquare}
          description="Manuscripts you have reviewed."
          colorClass="text-green-500"
        />
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="text-lg md:text-xl font-headline text-primary">Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
            The "Assigned Manuscripts" section is where you'll find articles to review.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
            (Full functionality for manuscript review is coming soon and requires database schema updates.)
            </p>
        </CardContent>
      </Card>

    </div>
  );
}
