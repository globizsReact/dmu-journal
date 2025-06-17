
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SubmitPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted to-secondary/10">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-3 text-lg font-medium text-foreground/80">
            <Link href="#" className="hover:text-primary">Author</Link>
            <Separator orientation="vertical" className="h-5 bg-border" />
            <Link href="#" className="hover:text-primary">Editor</Link>
            <Separator orientation="vertical" className="h-5 bg-border" />
            <Link href="#" className="hover:text-primary">Reviewer</Link>
          </div>
        </div>

        <Card className="w-full max-w-md shadow-xl bg-card">
          <CardHeader className="flex flex-col items-center pt-8 pb-6">
            <Image
              src="https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1"
              alt="University Crest"
              width={50}
              height={50}
              data-ai-hint="university crest"
              className="rounded-full mb-2"
            />
            <h1 className="text-xl font-headline text-primary">Dhanamanjuri University</h1>
            <p className="text-xs text-muted-foreground">JOURNAL</p>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter your username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="text-sm font-normal text-foreground/80">
                  Remember me
                </Label>
              </div>
              <Link href="#" className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Button type="submit" className="w-full bg-[#1A8A6D] hover:bg-[#166F57] text-primary-foreground">
              Sign In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="#" className="font-medium text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-8 text-sm text-muted-foreground">
          2025 Academic Journal
        </p>
      </main>

      <Footer />
    </div>
  );
}
