
// This file is no longer needed as signup is integrated into /src/app/submit/page.tsx
// You can safely delete this file.
// To prevent build errors if it's somehow still referenced,
// we'll just export a simple component.

import Link from 'next/link';

export default function DeprecatedSignupPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Sign Up Has Moved</h1>
      <p>The sign-up functionality is now part of the login page.</p>
      <Link href="/submit">
        Go to Login/Sign Up
      </Link>
    </div>
  );
}

    