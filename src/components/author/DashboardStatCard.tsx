import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface DashboardStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  colorClass?: string;
  actionButton?: {
    text: string;
    href: string;
  };
}

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  description,
  colorClass = "text-primary",
  actionButton,
}: DashboardStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-5 w-5", colorClass)} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", colorClass)}>{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      {actionButton && (
        <CardFooter className="pt-2 pb-4">
          <Button asChild size="sm" className="w-full">
            <Link href={actionButton.href}>{actionButton.text}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
