
"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FilePlus, BookUser, UserCog, LogOut, LucideIcon } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toPublicUrl } from '@/lib/urlUtils';


interface DashboardSidebarProps {
  authorName: string;
  avatarUrl: string | null;
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
  { label: 'Submit Manuscript', icon: FilePlus, tabKey: 'submitManuscript' },
  { label: 'My Manuscript', icon: BookUser, tabKey: 'myManuscript' },
  { label: 'View/Edit Profile', icon: UserCog, tabKey: 'editProfile' },
  { label: 'Logout', icon: LogOut, isLogout: true },
];

export default function DashboardSidebar({ authorName, avatarUrl, activeTab, onTabChange }: DashboardSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthorLoggedIn');
      localStorage.removeItem('authToken');
      localStorage.removeItem('authorName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('rememberAuthorLogin'); 
      localStorage.removeItem('rememberedUsername');
      localStorage.removeItem('avatarUrl');
      window.dispatchEvent(new CustomEvent('authChange'));
    }
    router.push('/submit');
  };

  const getInitials = (name: string) => {
    if (!name) return 'A';
    const names = name.split(' ');
    if (names.length === 1) return names[0][0];
    return names[0][0] + names[names.length - 1][0];
  };

  return (
    <aside className="w-full lg:w-64 self-start">
      <div className="mb-6 px-3 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={toPublicUrl(avatarUrl)} alt={authorName} data-ai-hint="placeholder avatar" />
          <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-headline font-semibold text-primary">Author</h2>
          <p className="text-sm text-muted-foreground">{authorName}</p>
        </div>
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
