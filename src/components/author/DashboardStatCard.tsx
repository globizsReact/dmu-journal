
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface DashboardStatCardProps {
  title: string;
  value: string;
  variant: 'default' | 'info' | 'success';
  viewAllHref: string;
  actionButton?: {
    text: string;
    href: string;
  };
}

export default function DashboardStatCard({
  title,
  value,
  variant,
  viewAllHref,
  actionButton,
}: DashboardStatCardProps) {
  let cardClasses = 'text-white';
  let titleClasses = 'opacity-90';
  let valueClasses = 'text-3xl md:text-4xl font-bold'; // Reduced font size
  let viewAllLinkClasses = 'text-white/80 hover:text-white';
  let actionButtonClasses = '';

  if (variant === 'default') {
    cardClasses = cn(cardClasses, 'bg-slate-600'); // Dark gray
  } else if (variant === 'info') {
    cardClasses = cn(cardClasses, 'bg-blue-600'); // Blue
  } else if (variant === 'success') {
    cardClasses = cn(cardClasses, 'bg-green-600'); // Green
    actionButtonClasses = 'bg-white text-green-700 hover:bg-slate-100 font-semibold shadow-sm';
  }

  return (
    <Card className={cn("shadow-lg flex flex-col justify-between", cardClasses)}> {/* Removed h-full */}
      <CardHeader className="pt-3 pb-1 px-3"> {/* Reduced padding */}
        <p className={cn("text-xs uppercase tracking-wider font-medium", titleClasses)}>{title}</p>
      </CardHeader>
      <CardContent className="text-center py-2 px-3 flex items-center justify-center"> {/* Removed flex-grow, reduced padding */}
        <p className={valueClasses}>{value}</p>
      </CardContent>
      <CardFooter className={cn("flex items-center pt-1 pb-3 px-3", actionButton ? "justify-between" : "justify-center")}> {/* Reduced padding */}
        <Button asChild variant="link" className={cn("p-0 h-auto text-sm", viewAllLinkClasses)}>
          <Link href={viewAllHref}>View All</Link>
        </Button>
        {actionButton && (
          <Button asChild size="sm" className={cn(actionButtonClasses, "ml-2")}>
            <Link href={actionButton.href}>{actionButton.text}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
