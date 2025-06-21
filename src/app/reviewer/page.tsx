import { redirect } from 'next/navigation';

// This page will redirect users from /reviewer to /reviewer/dashboard
export default function ReviewerRootPage() {
  redirect('/reviewer/dashboard');
  return null;
}
