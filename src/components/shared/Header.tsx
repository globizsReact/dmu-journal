import Link from 'next/link';
import { BookHeart } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-primary/20 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BookHeart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline text-primary">MemoirVerse</h1>
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
            Home
          </Link>
          {/* Add more navigation links if needed */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
