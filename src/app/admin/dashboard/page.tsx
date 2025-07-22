
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, FileText, BookOpen, Clock3, Loader2, AlertTriangle, UserPlus, FileUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';

// --- Types ---
interface StatData {
  totalUsers: number;
  totalSubmittedManuscripts: number;
  pendingManuscripts: number;
  totalJournals: number;
}
interface TimeSeriesData {
  date: string;
  count: number;
}
interface StatusDistributionData {
  status: string;
  count: number;
}
interface RecentActivity {
  id: string;
  type: 'NEW_USER' | 'NEW_MANUSCRIPT';
  text: string;
  timestamp: string;
  user?: { fullName?: string | null; avatarUrl?: string | null } | null
}

// --- Stat Card Component ---
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

// --- Chart Components ---
const SubmissionsChart = ({ data, isLoading }: { data: TimeSeriesData[]; isLoading: boolean }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-headline">Submissions Over Time</CardTitle>
      <CardDescription>Last 12 months</CardDescription>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="w-full h-[300px]" />
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Submissions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </CardContent>
  </Card>
);

const StatusDonutChart = ({ data, isLoading }: { data: StatusDistributionData[]; isLoading: boolean }) => {
    const COLORS: { [key: string]: string } = {
        Submitted: '#3b82f6', // blue-500
        'In Review': '#f97316', // orange-500
        Accepted: '#22c55e', // green-500
        Published: '#14b8a6', // teal-500
        Suspended: '#eab308', // yellow-500
        Rejected: '#ef4444', // red-500
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-headline">Manuscript Status</CardTitle>
                <CardDescription>Distribution of all manuscripts.</CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                    <Skeleton className="w-full h-[300px]" />
                ) : (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                    return (
                                        <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                                        {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                    }}>
                                    {data.map((entry) => (
                                        <Cell key={`cell-${entry.status}`} fill={COLORS[entry.status] || '#8884d8'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                <Legend iconSize={10} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// --- Recent Activity Component ---
const RecentActivityFeed = ({ activities, isLoading }: { activities: RecentActivity[]; isLoading: boolean }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-headline">Recent Activity</CardTitle>
    </CardHeader>
    <CardContent>
        {isLoading ? (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        ) : (
            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={activity.user?.avatarUrl || undefined} alt="User avatar" />
                            <AvatarFallback>
                                {activity.type === 'NEW_USER' ? <UserPlus className="w-4 h-4" /> : <FileUp className="w-4 h-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-sm" dangerouslySetInnerHTML={{ __html: activity.text }} />
                            <p className="text-xs text-muted-foreground">{format(parseISO(activity.timestamp), 'PPpp')}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </CardContent>
  </Card>
);

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState("Admin User"); 
  const [stats, setStats] = useState<StatData | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusDistributionData[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  const [isLoading, setIsLoading] = useState({
      counts: true,
      timeSeries: true,
      statusDist: true,
      activities: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const name = localStorage.getItem('authorName'); 
        if (name) setAdminName(name);
        const token = localStorage.getItem('authToken');

        if (token) {
          fetchData(token);
        } else {
          setIsLoading({ counts: false, timeSeries: false, statusDist: false, activities: false });
          setError("Not authenticated");
        }
    }
  }, []);

  const fetchData = async (token: string) => {
    setError(null);
    try {
      const [countsRes, timeSeriesRes, statusDistRes, activityRes] = await Promise.all([
        fetch('/api/admin/stats/counts', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/stats/submissions-over-time', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/stats/status-distribution', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/stats/recent-activity', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (!countsRes.ok || !timeSeriesRes.ok || !statusDistRes.ok || !activityRes.ok) {
        throw new Error('Failed to fetch dashboard data. Your session may have expired.');
      }
      
      const countsData = await countsRes.json();
      setStats(countsData);
      setIsLoading(prev => ({ ...prev, counts: false }));
      
      const timeSeriesData = await timeSeriesRes.json();
      setTimeSeriesData(timeSeriesData);
      setIsLoading(prev => ({ ...prev, timeSeries: false }));

      const statusDistData = await statusDistRes.json();
      setStatusDistribution(statusDistData);
      setIsLoading(prev => ({ ...prev, statusDist: false }));
      
      const activityData = await activityRes.json();
      setRecentActivities(activityData);
      setIsLoading(prev => ({ ...prev, activities: false }));

    } catch (err: any) {
      console.error("Error fetching admin dashboard data:", err);
      setError(err.message);
      setIsLoading({ counts: false, timeSeries: false, statusDist: false, activities: false });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">Admin Dashboard Overview</CardTitle>
          <CardDescription>Welcome, {adminName}! This is the central hub for managing journals, users, and submissions.</CardDescription>
        </CardHeader>
      </Card>

      {error ? (
         <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle size={20} /> Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive text-sm">{error}</p>
            <p className="text-xs text-muted-foreground mt-1">Please try refreshing or log in again.</p>
          </CardContent>
        </Card>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading.counts || !stats ? (
             [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <AdminStatCard title="Total Journals" value={stats.totalJournals} icon={BookOpen} description="Number of journal categories." colorClass="text-blue-500" />
              <AdminStatCard title="Total Users" value={stats.totalUsers} icon={Users} description="Registered authors, reviewers, etc." colorClass="text-green-500" />
              <AdminStatCard title="Pending Manuscripts" value={stats.pendingManuscripts} icon={Clock3} description="Awaiting review or decision." colorClass="text-orange-500" />
              <AdminStatCard title="Total Submitted Manuscripts" value={stats.totalSubmittedManuscripts} icon={FileText} description="All manuscripts in the system." colorClass="text-purple-500" />
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <SubmissionsChart data={timeSeriesData} isLoading={isLoading.timeSeries} />
            </div>
            <RecentActivityFeed activities={recentActivities} isLoading={isLoading.activities} />
        </div>
        
        <div className="grid grid-cols-1">
             <StatusDonutChart data={statusDistribution} isLoading={isLoading.statusDist} />
        </div>
        </>
      )}
    </div>
  );
}
