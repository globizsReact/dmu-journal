
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation'; // Not strictly needed here anymore, but kept for consistency

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const logoSrc = '/images/logo.png';
  // const router = useRouter(); // Not used in current logic

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authorSession = localStorage.getItem('isAuthorLoggedIn');
      setIsLoggedIn(authorSession === 'true');

      const handleAuthChange = () => {
        const authorSession = localStorage.getItem('isAuthorLoggedIn');
        setIsLoggedIn(authorSession === 'true');
      };
      window.addEventListener('authChange', handleAuthChange);

      return () => {
        window.removeEventListener('authChange', handleAuthChange);
      };
    }
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className={cn("py-3 px-4 md:px-8 bg-primary text-primary-foreground relative z-40", className)}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Image
              src={logoSrc}
              alt="Dhanamanjuri University Logo"
              width={40}
              height={40}
              data-ai-hint="university logo"
              className="rounded-full"
            />
            <div className="hidden lg:block">
              <h1 className="text-xl md:text-2xl font-headline">Dhanamanjuri University</h1>
              <p className="text-xs md:text-sm font-body opacity-80">JOURNAL</p>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-4 md:space-x-6 items-center">
            <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">
              HOME
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">
              ABOUT US
            </Link>
            {!isLoggedIn && (
              <Link href="/submit" className="text-sm font-medium hover:text-accent transition-colors">
                CALL FOR PAPER SUBMISSION
              </Link>
            )}
            {isLoggedIn && (
              <Link href="/author/dashboard" className="text-sm font-medium hover:text-accent transition-colors">
                DASHBOARD
              </Link>
            )}
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-primary-foreground hover:text-accent transition-colors p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ease-out md:hidden"
          style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        />
      )}

      <nav
        className={`
          fixed inset-y-0 right-0 w-3/4 max-w-xs bg-black p-4 z-50 shadow-lg md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex items-center justify-between mb-6">
            <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Image
                src={logoSrc} // Using the consistent logoSrc for mobile drawer as well
                alt="Dhanamanjuri University Logo"
                width={32}
                height={32}
                data-ai-hint="university logo"
                className="rounded-full"
              />
              <div>
                <h1 className="text-base font-headline text-primary-foreground">DM University</h1>
                <p className="text-xs font-body text-primary-foreground/80">JOURNAL</p>
              </div>
            </Link>
           <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="text-primary-foreground hover:text-accent transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>
        <Link
          href="/"
          onClick={handleLinkClick}
          className="block py-3 text-md font-medium text-primary-foreground hover:text-accent transition-colors"
        >
          HOME
        </Link>
        <Link
          href="/about"
          onClick={handleLinkClick}
          className="block py-3 text-md font-medium text-primary-foreground hover:text-accent transition-colors"
        >
          ABOUT US
        </Link>
        {!isLoggedIn && (
          <Link
            href="/submit"
            onClick={handleLinkClick}
            className="block py-3 text-md font-medium text-primary-foreground hover:text-accent transition-colors"
          >
            CALL FOR PAPER SUBMISSION
          </Link>
        )}
        {isLoggedIn && (
          <Link
            href="/author/dashboard"
            onClick={handleLinkClick}
            className="block py-3 text-md font-medium text-primary-foreground hover:text-accent transition-colors"
          >
            DASHBOARD
          </Link>
        )}
      </nav>
    </>
  );
};

export default Header;
