
import Link from 'next/link';
import { cn } from '@/lib/utils';

const FooterLink = ({ href, children, target }: { href: string; children: React.ReactNode, target?: string }) => (
  <Link href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
    {children}
  </Link>
);

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <>
      <footer className={cn("py-10 md:py-16 px-4 md:px-8 bg-primary text-primary-foreground", className)}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
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
            
            <div>
             <h4 className="font-headline text-lg text-accent mb-3">CONTACT</h4>
             <p className="text-sm text-primary-foreground/80">98561 - 98561</p>
             <p className="text-sm text-primary-foreground/80">Thangmeiband, Imphal West, 795001</p>
             <p className="text-sm text-primary-foreground/80">
               E-Mail: <a href="mailto:Dmcollege_science@Yahoo.Co.In" className="hover:text-accent transition-colors underline">Dmcollege_science@Yahoo.Co.In</a>
             </p>
           </div>
          </div>
        </div>
      </footer>
      <div className={cn("py-3 bg-black text-center text-xs text-gray-400", className?.includes('relative') ? '' : className )}> {/* Avoid passing z-index to this part */}
        <p>Design &amp; Developed By: <Link href="#" className="hover:text-accent transition-colors">Globizs</Link></p>
      </div>
    </>
  );
};

export default Footer;
