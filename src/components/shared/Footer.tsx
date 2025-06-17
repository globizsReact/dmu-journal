import Link from 'next/link';
import Image from 'next/image';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
    {children}
  </Link>
);

const Footer = () => {
  return (
    <>
      <footer className="py-10 md:py-16 px-4 md:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            
            <div className="lg:col-span-2 flex flex-col items-start">
               <Link href="/" className="flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity">
                <Image 
                  src="https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1" 
                  alt="University Crest" 
                  width={40} 
                  height={40} 
                  data-ai-hint="university crest"
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-xl font-headline">Dhanamanjuri University</h1>
                  <p className="text-xs opacity-80">JOURNAL</p>
                </div>
              </Link>
              {/* Optional: Add a short description about the university journal here if needed */}
            </div>

            <div>
              <h4 className="font-headline text-lg text-accent mb-3">AUTHOR</h4>
              <ul className="space-y-2">
                <li><FooterLink href="/author/sanatomba-meitei">Dr. Sanatomba Meitei</FooterLink></li>
                <li><FooterLink href="/author/aribam-vishaal-sharma">Dr. Aribam Vishaal Sharma</FooterLink></li>
                <li><FooterLink href="/author/ph-parmila-devi">Dr. PH Parmila Devi</FooterLink></li>
                <li><FooterLink href="/author/sangeeta-kumari">Dr. Sangeeta Kumari</FooterLink></li>
              </ul>
            </div>

            <div>
              <h4 className="font-headline text-lg text-accent mb-3">REVIEWERS</h4>
              <ul className="space-y-2">
                <li><FooterLink href="/reviewers-guidelines">Reviewers Guidelines</FooterLink></li>
                <li><FooterLink href="/peer-review">Peer Review</FooterLink></li>
              </ul>
            </div>

            <div>
              <h4 className="font-headline text-lg text-accent mb-3">QUICK LINKS</h4>
              <ul className="space-y-2">
                <li><FooterLink href="https://dmu.ac.in/" target="_blank">Dhanamanjuri University</FooterLink></li>
                <li><FooterLink href="https://manipuruniv.ac.in/" target="_blank">Manipur University</FooterLink></li>
                <li><FooterLink href="https://www.ugc.gov.in/" target="_blank">University Grants Commission (UGC)</FooterLink></li>
              </ul>
            </div>
          </div>
           <div className="border-t border-primary-foreground/20 pt-8 mt-8 text-center md:text-left">
             <h4 className="font-headline text-lg text-accent mb-2">CONTACT</h4>
             <p className="text-sm text-primary-foreground/80">98561 - 98561</p>
             <p className="text-sm text-primary-foreground/80">Thangmeiband, Imphal West, 795001</p>
             <p className="text-sm text-primary-foreground/80">
               E-Mail: <a href="mailto:Dmcollege_science@Yahoo.Co.In" className="hover:text-accent transition-colors underline">Dmcollege_science@Yahoo.Co.In</a>
             </p>
           </div>
        </div>
      </footer>
      <div className="py-3 bg-black text-center text-xs text-gray-400">
        <p>Design &amp; Developed By: <Link href="#" className="hover:text-accent transition-colors">Globizs</Link></p>
      </div>
    </>
  );
};

export default Footer;
