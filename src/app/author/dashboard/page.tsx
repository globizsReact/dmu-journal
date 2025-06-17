
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import DashboardSidebar from '@/components/author/DashboardSidebar';
import DashboardStatCard from '@/components/author/DashboardStatCard';
import type { DashboardStatCardProps } from '@/components/author/DashboardStatCard';

const dashboardItems: DashboardStatCardProps[] = [
  { title: 'NEW SUBMISSION', value: '0', variant: 'default', viewAllHref: '#' },
  { title: 'MANUSCRIPTS IN REVIEW', value: '0', variant: 'info', viewAllHref: '#' },
  { title: 'ACCEPTED MANUSCRIPTS', value: '0', variant: 'default', viewAllHref: '#' },
  { 
    title: 'PAYMENTS DUE', 
    value: '$0.00', 
    variant: 'success', 
    viewAllHref: '#', 
    actionButton: { text: 'Pay Now', href: '#'} 
  },
  { title: 'PUBLISHED MANUSCRIPTS', value: '0', variant: 'info', viewAllHref: '#' },
  { title: 'SUSPENDED MANUSCRIPTS', value: '0', variant: 'default', viewAllHref: '#' },
  { title: 'WAIVER REQUESTS', value: '0', variant: 'default', viewAllHref: '#' },
];

export default function AuthorDashboardPage() {
  const authorName = "Dr. Santosh Sharma";

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <DashboardSidebar authorName={authorName} />
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
          <h1 className="text-3xl font-headline font-bold text-primary mb-8">Author Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map((item) => (
              <DashboardStatCard
                key={item.title}
                title={item.title}
                value={item.value}
                variant={item.variant}
                viewAllHref={item.viewAllHref}
                actionButton={item.actionButton}
              />
            ))}
          </div>

          <div className="text-center mt-12 text-muted-foreground">
            <p>2025 Academic Journal</p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
