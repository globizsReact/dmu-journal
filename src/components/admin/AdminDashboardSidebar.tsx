
"use client";

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Users, BookIcon, LucideIcon, Layers, Settings, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

interface AdminDashboardSidebarProps {
  adminName: string;
  onLinkClick?: () => void;
  isMobileSheet?: boolean;
}

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  disabled?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Manage Journals', icon: BookIcon, href: '/admin/dashboard/journals', disabled: false },
  { label: 'All Manuscripts', icon: FileText, href: '/admin/dashboard/manuscripts' },
  { label: 'Manage Users', icon: Users, href: '/admin/dashboard/users', disabled: false },
];

const pageNavItems = [
    { label: 'About Us Page', href: '/admin/dashboard/pages/about' },
    { label: 'Membership Page', href: '/admin/dashboard/pages/membership' },
    { label: 'Support Center Page', href: '/admin/dashboard/pages/support-center' },
    { label: 'Landing Page', href: '/admin/dashboard/pages/landing' },
    { label: "Manage FAQ", href: '/admin/dashboard/faq' },
    { label: 'Footer Settings', href: '/admin/dashboard/pages/footer' },
];

export default function AdminDashboardSidebar({ adminName, onLinkClick, isMobileSheet = false }: AdminDashboardSidebarProps) {
  const pathname = usePathname();
  const logoSrc = '/images/logo_black.png';
  
  const isPagesActive = pageNavItems.some(item => pathname.startsWith(item.href)) || pathname.startsWith('/admin/dashboard/faq');

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
          <h2 id="admin-sidebar-title" className="text-lg font-headline font-semibold text-primary leading-tight">Admin Panel</h2>
          <p className="text-xs text-muted-foreground leading-tight">DMU Journal</p>
        </div>
      </div>
      <nav className="flex-1 space-y-2">
        {mainNavItems.map((item) => {
          let isActive = pathname === item.href;
          if (item.href === '/admin/dashboard' && pathname !== '/admin/dashboard' && pathname.startsWith('/admin/dashboard/')) {
             isActive = false;
          } else if (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)) {
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
                  if (item.disabled) e.preventDefault();
                  else onLinkClick?.();
              }}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
        
        {/* Pages Accordion */}
        <Accordion type="single" collapsible className="w-full" defaultValue={isPagesActive ? 'pages' : undefined}>
          <AccordionItem value="pages" className="border-none">
            <AccordionTrigger className={cn(
                "w-full flex items-center justify-between gap-3 py-2.5 px-3 rounded-md text-sm font-medium transition-colors text-left hover:bg-muted hover:text-primary hover:no-underline",
                isPagesActive && "bg-muted text-primary"
            )}>
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                Manage Pages
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-0 pl-8 pr-0 space-y-1">
              {pageNavItems.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                return (
                  <Link 
                    key={item.label} 
                    href={item.href} 
                    onClick={onLinkClick}
                    className={cn(
                      "w-full flex items-center gap-3 py-2 px-3 rounded-md text-sm font-medium transition-colors text-left",
                      isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-foreground hover:bg-muted hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
         <p className="text-xs text-muted-foreground px-3 mb-2 truncate" title={adminName}>Logged in as: {adminName}</p>
      </div>
    </aside>
  );
}
