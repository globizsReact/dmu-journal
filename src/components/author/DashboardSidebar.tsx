
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FilePlus, BookUser, UserCog, LogOut } from 'lucide-react';

interface DashboardSidebarProps {
  authorName: string;
}

const navItems = [
  { href: '/author/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '#', label: 'Submit Manuscript', icon: FilePlus }, // Placeholder href
  { href: '#', label: 'My Manuscript', icon: BookUser },     // Placeholder href
  { href: '#', label: 'View/Edit Profile', icon: UserCog },// Placeholder href
  { href: '/submit', label: 'Logout', icon: LogOut }, // Logout button
];

export default function DashboardSidebar({ authorName }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 bg-card p-6 rounded-lg shadow-sm self-start">
      <div className="mb-6">
        <h2 className="text-xl font-headline font-semibold text-primary">Author</h2>
        <p className="text-sm text-muted-foreground">{authorName}</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href && item.label !== 'Logout'; // Logout shouldn't stay active
          const isLogoutButton = item.label === 'Logout';
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium transition-colors",
                "hover:bg-muted hover:text-primary",
                isActive 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" 
                  : "text-foreground",
                isLogoutButton && "text-destructive-foreground bg-destructive hover:bg-destructive/90 hover:text-destructive-foreground" // Specific styling for logout
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
