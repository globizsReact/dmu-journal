
'use client';

import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { useMemo } from 'react';
import type { JSONContent } from '@tiptap/core';

interface TiptapRendererProps {
  jsonContent: any; // JSON from Tiptap
  className?: string;
}

const TiptapRenderer = ({ jsonContent, className }: TiptapRendererProps) => {
  const output = useMemo(() => {
    // Handle legacy string data if it exists in the DB
    if (typeof jsonContent === 'string') {
      return `<p>${jsonContent}</p>`;
    }
    if (!jsonContent || typeof jsonContent !== 'object' || !jsonContent.type) {
      return '';
    }
    return generateHTML(jsonContent as JSONContent, [StarterKit]);
  }, [jsonContent]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: output }}
    />
  );
};

export default TiptapRenderer;
