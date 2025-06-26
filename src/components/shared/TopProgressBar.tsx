
'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // This effect runs when the new page component has started to render.
    // We make the progress bar animation fast to reflect this.
    
    // Clear any existing timers to prevent race conditions from rapid navigation
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Reset and show the progress bar
    setProgress(0);
    setIsVisible(true);

    // Animate the loading process quickly
    timerRef.current = setTimeout(() => {
      setProgress(90); // Jump quickly to 90%
    }, 50); // A small delay to allow the initial 0% state to render

    // After a short delay, complete the loading and hide the bar
    timerRef.current = setTimeout(() => {
      setProgress(100);
      
      // After the '100%' animation completes, start the fade-out
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        
        // After it's hidden, reset the progress for the next navigation
        timerRef.current = setTimeout(() => {
          setProgress(0);
        }, 300); // Match the opacity transition duration in the style
      }, 200); // Let the 100% bar be visible for a moment
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
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
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: 'hsl(var(--accent))',
          transition: 'width 0.2s ease-out',
          boxShadow: '0 0 10px hsl(var(--accent)), 0 0 5px hsl(var(--accent))',
        }}
      />
    </div>
  );
}
