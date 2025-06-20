
"use client";

import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Users, BookCheck, LogOut, LucideIcon, ShieldAlert } from 'lucide-react'; // Added Users
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // Import Link for navigation

interface AdminDashboardSidebarProps {
  adminName: string;
  activeTab: string; // This might be derived from path or passed down
  onTabChange: (tabKey: string) => void; // This might trigger navigation or state update
}

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string; // Changed from tabKey to href for navigation
  isLogout?: boolean;
}

// Define navigation items with hrefs
const navItems: NavItem[] = [
  { label: 'Dashboard Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'All Manuscripts', icon: FileText, href: '/admin/dashboard/manuscripts' },
  { label: 'Manage Users', icon: Users, href: '/admin/dashboard/users' }, // Example for future
  { label: 'Manage Journals', icon: BookCheck, href: '/admin/dashboard/journals' }, // Example for future
  // Logout is handled separately
];

export default function AdminDashboardSidebar({ adminName }: AdminDashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname(); // Get current path to determine active link

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthorLoggedIn');
      localStorage.removeItem('authorName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('authToken');
      localStorage.removeItem('rememberAuthorLogin');
      localStorage.removeItem('rememberedUsername');
      window.dispatchEvent(new CustomEvent('authChange'));
    }
    router.push('/submit'); // Redirect to login page
  };

  return (
    // This sidebar will be part of AdminLayout.tsx
    <aside className="w-64 bg-card border-r border-border flex flex-col p-4 shadow-md">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-6 h-6 text-orange-500"/>
          <h2 className="text-xl font-headline font-semibold text-primary">Admin Panel</h2>
        </div>
        <p className="text-sm text-muted-foreground truncate" title={adminName}>{adminName}</p>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/admin/dashboard' && pathname.startsWith('/admin/dashboard') && !navItems.find(n => n.href !== '/admin/dashboard' && pathname.startsWith(n.href)) );
          // Special handling for base dashboard path

          return (
            <Link key={item.label} href={item.href} legacyBehavior>
              <a
                className={cn(
                  "w-full flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium transition-colors text-left",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground hover:bg-muted hover:text-primary"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full flex items-center justify-start gap-3 py-2.5 px-3 rounded-md text-sm font-medium transition-colors",
                "text-destructive hover:bg-destructive/10"
              )}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out from the admin panel?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
