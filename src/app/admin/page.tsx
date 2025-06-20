
import { redirect } from 'next/navigation';

// This page will redirect users from /admin to /admin/dashboard
export default function AdminRootPage() {
  redirect('/admin/dashboard');
  // Optionally, you can return null or a loading indicator if needed,
  // but redirect typically handles this.
  return null;
}
