
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; // Import for potential refresh

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');
  const router = useRouter(); // For potential refresh if needed

  useEffect(() => {
    // Ensure this only runs on the client
    if (typeof window !== 'undefined') {
      const authorSession = localStorage.getItem('isAuthorLoggedIn');
      setIsLoggedIn(authorSession === 'true');

      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (storedTheme) {
        setCurrentTheme(storedTheme);
        if (storedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else if (prefersDark) {
        setCurrentTheme('dark');
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        setCurrentTheme('light'); // Default if nothing else
        document.documentElement.classList.remove('dark'); // Ensure no dark class
        localStorage.setItem('theme', 'light'); // Store default
      }
    }

    // Listen for custom event to update header on login/logout
    const handleAuthChange = () => {
      const authorSession = localStorage.getItem('isAuthorLoggedIn');
      setIsLoggedIn(authorSession === 'true');
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };

  }, []); // Empty dependency array means this runs once on mount and on event listener registration

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className="py-4 px-4 md:px-8 bg-primary text-primary-foreground shadow-md relative z-40">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Image
              src="/images/logo.png"
              alt="Dhanamanjuri University Logo"
              width={40}
              height={40}
              data-ai-hint="university logo"
              className="rounded-full"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-headline">Dhanamanjuri University</h1>
              <p className="text-xs md:text-sm font-body opacity-80">JOURNAL</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 md:space-x-6 items-center">
            <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">
              HOME
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">
              ABOUT US
            </Link>
            <Link href="/submit" className="text-sm font-medium hover:text-accent transition-colors">
              CALL FOR PAPER SUBMISSION
            </Link>
            {isLoggedIn && (
              <Link href="/author/dashboard" className="text-sm font-medium hover:text-accent transition-colors">
                DASHBOARD
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
              className="text-primary-foreground hover:text-accent hover:bg-primary/80"
            >
              {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
          </nav>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
              className="text-primary-foreground hover:text-accent hover:bg-primary/80"
            >
              {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
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

      {/* Backdrop for Mobile Menu */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ease-out md:hidden"
          style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        />
      )}

      {/* Mobile Navigation Menu */}
      <nav
        className={`
          fixed inset-y-0 right-0 w-3/4 max-w-xs bg-primary p-4 z-50 shadow-lg md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex justify-end mb-4">
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
        <Link
          href="/submit"
          onClick={handleLinkClick}
          className="block py-3 text-md font-medium text-primary-foreground hover:text-accent transition-colors"
        >
          CALL FOR PAPER SUBMISSION
        </Link>
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
