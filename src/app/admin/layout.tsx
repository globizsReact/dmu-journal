
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminDashboardSidebar from '@/components/admin/AdminDashboardSidebar';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { Loader2, Menu as MenuIcon, Settings, LogOut, Moon, Sun, User } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('userRole');
        const name = localStorage.getItem('authorName');
        const avatar = localStorage.getItem('avatarUrl');

        if (token && role === 'admin') {
          setIsAuthenticatedAdmin(true);
          if (name) setAdminName(name);
          if (avatar) setAdminAvatar(avatar);
        } else {
          setIsAuthenticatedAdmin(false);
        }
        setIsLoadingSession(false);
      };
      
      checkAuth();
      window.addEventListener('authChange', checkAuth);
      return () => {
        window.removeEventListener('authChange', checkAuth);
      };
    }
  }, []);

  useEffect(() => {
    setIsMobileSheetOpen(false);
  }, [pathname]);


  const handleLoginSuccess = () => {
    setIsAuthenticatedAdmin(true);
    const name = localStorage.getItem('authorName');
    const avatar = localStorage.getItem('avatarUrl');
    if (name) setAdminName(name);
    if (avatar) setAdminAvatar(avatar);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('authorName');
        localStorage.removeItem('avatarUrl');
        window.dispatchEvent(new CustomEvent('authChange'));
        setIsMobileSheetOpen(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  if (isLoadingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticatedAdmin) {
    return (
      <>
        <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-muted/40">
      {/* Mobile Sidebar */}
      <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
          <SheetContent side="left" className="p-0 w-64" aria-labelledby="admin-sidebar-title">
              <SheetTitle className="sr-only" id="admin-sidebar-title">Admin Navigation Menu</SheetTitle>
              <AdminDashboardSidebar
                  adminName={adminName}
                  onLinkClick={() => setIsMobileSheetOpen(false)}
                  isMobileSheet={true}
              />
          </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminDashboardSidebar adminName={adminName} />
      </div>

      <div className="flex flex-1 flex-col overflow-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 md:hidden">
                    <MenuIcon className="h-4 w-4" />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </SheetTrigger>
             <h1 className="text-md font-semibold text-primary hidden sm:block">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">{adminName}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={adminAvatar || undefined} alt={adminName} data-ai-hint="placeholder avatar" />
                  <AvatarFallback>{getInitials(adminName)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{adminName}</p>
                    <p className="text-xs leading-none text-muted-foreground">Administrator</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/admin/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-destructive focus:text-destructive">
                       <LogOut className="mr-2 h-4 w-4" />
                       <span>Logout</span>
                    </DropdownMenuItem>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
