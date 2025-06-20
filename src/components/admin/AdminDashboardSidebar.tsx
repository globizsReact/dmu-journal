
"use client";

import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Users, BookCheck, LogOut, LucideIcon, ShieldAlert } from 'lucide-react';
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
import Link from 'next/link';

interface AdminDashboardSidebarProps {
  adminName: string;
  activeTab: string; 
  onTabChange: (tabKey: string) => void; 
  onLogout: () => void; 
}

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'All Manuscripts', icon: FileText, href: '/admin/dashboard/manuscripts' },
  // { label: 'Manage Users', icon: Users, href: '/admin/dashboard/users' }, 
  // { label: 'Manage Journals', icon: BookCheck, href: '/admin/dashboard/journals' },
];

export default function AdminDashboardSidebar({ adminName, onLogout }: AdminDashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();


  return (
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
          let isActive = pathname === item.href;
          if (item.href === '/admin/dashboard' && pathname.startsWith('/admin/dashboard') && pathname !== '/admin/dashboard/manuscripts') {
             isActive = true;
             if (navItems.some(nav => nav.href !== item.href && pathname.startsWith(nav.href))) {
                 isActive = false; 
             }
          } else if (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)) {
            isActive = true;
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium transition-colors text-left",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-foreground hover:bg-muted hover:text-primary"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
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
              <AlertDialogAction onClick={onLogout} className="bg-destructive hover:bg-destructive/90">Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
