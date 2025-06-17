'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="py-4 px-4 md:px-8 bg-primary text-primary-foreground shadow-md relative">
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
        <nav className="hidden md:flex space-x-4 md:space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">
            HOME
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">
            ABOUT US
          </Link>
          <Link href="/submit" className="text-sm font-medium hover:text-accent transition-colors">
            CALL FOR PAPER SUBMISSION
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="text-primary-foreground hover:text-accent transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-primary shadow-lg p-4 z-50">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="block py-2 text-sm font-medium text-primary-foreground hover:text-accent transition-colors"
          >
            HOME
          </Link>
          <Link
            href="/about"
            onClick={handleLinkClick}
            className="block py-2 text-sm font-medium text-primary-foreground hover:text-accent transition-colors"
          >
            ABOUT US
          </Link>
          <Link
            href="/submit"
            onClick={handleLinkClick}
            className="block py-2 text-sm font-medium text-primary-foreground hover:text-accent transition-colors"
          >
            CALL FOR PAPER SUBMISSION
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
