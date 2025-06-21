"use client";

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, BadgeCheck, LogOut, LucideIcon } from 'lucide-react';
import Image from 'next/image';
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

interface ReviewerDashboardSidebarProps {
  reviewerName: string;
  onLogout: () => void;
  onLinkClick?: () => void;
  isMobileSheet?: boolean;
}

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/reviewer/dashboard' },
  { label: 'Assigned Manuscripts', icon: FileText, href: '/reviewer/dashboard/manuscripts', disabled: true },
  { label: 'Review Guidelines', icon: BadgeCheck, href: '/reviewer/dashboard/guidelines', disabled: true },
];

export default function ReviewerDashboardSidebar({ reviewerName, onLogout, onLinkClick, isMobileSheet = false }: ReviewerDashboardSidebarProps) {
  const pathname = usePathname();
  const logoSrc = '/images/logo_black.png';

  return (
    <aside className={cn(
        "bg-card flex flex-col p-4 h-full",
        isMobileSheet ? "w-full" : "w-64 border-r border-border shadow-md"
    )}>
      <div className="mb-8 px-2 flex items-center gap-3">
        <Image
          src={logoSrc}
          alt="DMU Journal Logo"
          width={40}
          height={40}
          className="rounded-full"
          data-ai-hint="university logo"
        />
        <div>
          <h2 id="reviewer-sidebar-title" className="text-lg font-headline font-semibold text-primary leading-tight">Reviewer Panel</h2>
          <p className="text-xs text-muted-foreground leading-tight">DMU Journal</p>
        </div>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          let isActive = pathname === item.href;
          if (item.href !== '/reviewer/dashboard' && pathname.startsWith(item.href)) {
             isActive = true;
          }

          return (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "w-full flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium transition-colors text-left",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-foreground hover:bg-muted hover:text-primary",
                item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-foreground"
              )}
              aria-disabled={item.disabled}
              onClick={(e) => {
                  if (item.disabled) {
                      e.preventDefault();
                      // Optional: toast('This feature is coming soon!');
                  } else {
                      onLinkClick?.();
                  }
              }}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
         <p className="text-xs text-muted-foreground px-3 mb-2 truncate" title={reviewerName}>Logged in as: {reviewerName}</p>
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
                Are you sure you want to log out from the reviewer panel?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { onLogout(); onLinkClick?.(); }} className="bg-destructive hover:bg-destructive/90">Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
