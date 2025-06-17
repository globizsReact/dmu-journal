const Footer = () => {
  return (
    <footer className="py-8 px-4 md:px-8 border-t border-primary/20 bg-background/50">
      <div className="container mx-auto text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MemoirVerse. All rights reserved.</p>
        <p className="text-sm mt-1">Crafted with care for your stories.</p>
      </div>
    </footer>
  );
};

export default Footer;
