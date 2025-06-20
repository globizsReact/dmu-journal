import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import TopProgressBar from '@/components/shared/TopProgressBar';

export const metadata: Metadata = {
  title: 'DMU Journal', // Updated project title
  description: 'Dhanamanjuri University Journals Portal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This RootLayout applies to non-admin pages.
  // Admin pages will use src/app/admin/layout.tsx
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Poltawski+Nowy:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {/* TopProgressBar might still be useful globally, or moved to specific layouts */}
        <TopProgressBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
