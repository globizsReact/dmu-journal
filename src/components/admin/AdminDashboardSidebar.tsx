
"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, BookCheck, UserCog, LogOut, LucideIcon, ShieldAlert } from 'lucide-react';
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

interface AdminDashboardSidebarProps {
  adminName: string;
  activeTab: string;
  onTabChange: (tabKey: string) => void;
}

interface NavItem {
  label: string;
  icon: LucideIcon;
  tabKey?: string;
  isLogout?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, tabKey: 'dashboard' },
  { label: 'View Manuscripts', icon: FileText, tabKey: 'viewManuscripts' },
  // Future items could be:
  // { label: 'Manage Reviewers', icon: UsersRound, tabKey: 'manageReviewers' },
  // { label: 'Journal Settings', icon: Settings, tabKey: 'journalSettings' },
  { label: 'Logout', icon: LogOut, isLogout: true },
];

export default function AdminDashboardSidebar({ adminName, activeTab, onTabChange }: AdminDashboardSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthorLoggedIn'); // Consider renaming to isUserLoggedIn
      localStorage.removeItem('authorName'); // Consider renaming to userName
      localStorage.removeItem('userRole');
      localStorage.removeItem('authToken');
      localStorage.removeItem('rememberAuthorLogin'); 
      localStorage.removeItem('rememberedUsername');
      window.dispatchEvent(new CustomEvent('authChange'));
    }
    router.push('/submit'); // Redirect to login/submit page
  };

  return (
    <aside className="w-full lg:w-64 self-start">
      <div className="mb-6 px-3">
        <h2 className="text-xl font-headline font-semibold text-primary flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2 text-orange-500"/> Admin Panel
        </h2>
        <p className="text-sm text-muted-foreground">{adminName}</p>
      </div>
      <nav className="space-y-2 px-3 pb-3">
        {navItems.map((item) => {
          const isActive = item.tabKey === activeTab && !item.isLogout;

          if (item.isLogout) {
            return (
              <AlertDialog key={item.label}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className={cn(
                      "w-full flex items-center justify-start gap-3 py-2.5 px-3 rounded-md text-sm font-medium transition-colors",
                      "text-destructive-foreground bg-destructive hover:bg-destructive/90 hover:text-destructive-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => item.tabKey && onTabChange(item.tabKey)}
              className={cn(
                "w-full flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium transition-colors text-left",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  : "text-foreground hover:bg-primary/10 hover:text-primary"
              )}
              disabled={!item.tabKey}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
