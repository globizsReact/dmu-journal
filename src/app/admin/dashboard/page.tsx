
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, FileText, BookOpen, Clock3, Loader2, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatData {
  totalUsers: number;
  totalSubmittedManuscripts: number;
  pendingManuscripts: number;
  totalJournals: number;
}

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  colorClass?: string;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({ title, value, icon: Icon, description, colorClass = "text-primary" }) => (
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

const StatCardSkeleton: React.FC = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-5 rounded-full" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-7 w-12 mb-1" />
      <Skeleton className="h-3 w-24" />
    </CardContent>
  </Card>
);


export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState("Admin User"); 
  const [stats, setStats] = useState<StatData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const name = localStorage.getItem('authorName'); 
        if (name) {
            setAdminName(name);
        }
        const token = localStorage.getItem('authToken');
        if (token) {
          fetchStats(token);
        } else {
          setIsLoadingStats(false);
        }
    }
  }, []);

  const fetchStats = async (token: string) => {
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const response = await fetch('/api/admin/stats/counts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('authorName');
            window.dispatchEvent(new CustomEvent('authChange'));
          }
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch stats: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error: any) {
      console.error("Error fetching admin stats:", error);
      setStatsError(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoadingStats(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">Admin Dashboard Overview</CardTitle>
          <CardDescription>Welcome, {adminName}! This is the central hub for managing journals, users, and submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            From here, you can monitor site activity and manage various aspects of the journal portal.
          </p>
        </CardContent>
      </Card>

      {isLoadingStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      )}

      {statsError && (
         <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle size={20} /> Error Loading Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive text-sm">{statsError}</p>
            <p className="text-xs text-muted-foreground mt-1">Please try refreshing or check login.</p>
          </CardContent>
        </Card>
      )}

      {!isLoadingStats && !statsError && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard 
            title="Total Journals" 
            value={stats.totalJournals} 
            icon={BookOpen}
            description="Number of journal categories."
            colorClass="text-blue-500"
          />
          <AdminStatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={Users}
            description="Registered authors, reviewers, etc."
            colorClass="text-green-500"
          />
          <AdminStatCard 
            title="Pending Manuscripts" 
            value={stats.pendingManuscripts} 
            icon={Clock3}
            description="Awaiting review or decision."
            colorClass="text-orange-500"
          />
          <AdminStatCard 
            title="Total Submitted Manuscripts" 
            value={stats.totalSubmittedManuscripts} 
            icon={FileText}
            description="All manuscripts in the system."
            colorClass="text-purple-500"
          />
        </div>
      )}

       <Card>
        <CardHeader>
            <CardTitle className="text-lg md:text-xl font-headline text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
            Use the sidebar to navigate to specific management sections:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
            <li>View and manage all submitted manuscripts.</li>
            <li>Oversee user accounts (authors, reviewers, editors).</li>
            <li>Manage journal categories and settings.</li>
            </ul>
        </CardContent>
      </Card>

    </div>
  );
}
