
'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const primaryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const secondaryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any ongoing timers and intervals from previous navigations
    if (primaryTimerRef.current) clearTimeout(primaryTimerRef.current);
    if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setProgress(0);
    setIsVisible(true);

    let currentProg = 0;
    progressIntervalRef.current = setInterval(() => {
      currentProg += Math.random() * 20 + 10; // Increment progress a bit more aggressively
      if (currentProg >= 90) {
        currentProg = 90;
        setProgress(currentProg);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        
        // Now that we're at 90%, this useEffect is running because the page has "loaded".
        // So, complete to 100% and then fade out.
        setProgress(100);
        primaryTimerRef.current = setTimeout(() => {
          setIsVisible(false);
          // After fade out, reset progress
          secondaryTimerRef.current = setTimeout(() => {
            setProgress(0);
          }, 300); // Corresponds to opacity transition duration
        }, 250); // Reduced time for 100% to be visible before fading (was 500ms)
      } else {
        setProgress(currentProg);
      }
    }, 50); // Reduced interval for progress simulation (was 80ms)

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (primaryTimerRef.current) clearTimeout(primaryTimerRef.current);
      if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current);
    };
  }, [pathname, searchParams]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
        pointerEvents: 'none', // Ensure it doesn't block interactions
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: 'hsl(var(--accent))',
          transition: progress === 100 && isVisible ? 'width 0.15s linear' : 'width 0.05s linear' , // Faster transitions
          boxShadow: '0 0 10px hsl(var(--accent)), 0 0 5px hsl(var(--accent))' // Optional: add a glow effect
        }}
      />
    </div>
  );
}
