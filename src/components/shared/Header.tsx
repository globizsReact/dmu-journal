import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="py-4 px-4 md:px-8 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Image 
            src="https://placehold.co/50x50.png" 
            alt="University Crest" 
            width={40} 
            height={40} 
            data-ai-hint="university crest"
            className="rounded-full"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-headline">Dhanamanjuri University</h1>
            <p className="text-xs md:text-sm font-body opacity-80">JOURNAL</p>
          </div>
        </Link>
        <nav className="space-x-4 md:space-x-6">
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
      </div>
    </header>
  );
};

export default Header;
