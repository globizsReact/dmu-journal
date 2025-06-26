
'use client';

import TiptapRenderer from '../shared/TiptapRenderer';
import type { JSONContent } from '@tiptap/core';

interface RequirementRow {
  heading: string;
  content: JSONContent;
}

interface TableViewProps {
  content: any;
}

export default function TableView({ content }: TableViewProps) {
  if (!Array.isArray(content) || content.length === 0) {
    return <p className="text-muted-foreground">This section is empty.</p>;
  }

  const rows = content as RequirementRow[];

  return (
    <div className="py-8 space-y-4">
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 border-b py-4">
          <div className="md:col-span-1">
            <h4 className="font-headline text-md font-semibold text-primary sticky top-20">
              {row.heading}
            </h4>
          </div>
          <div className="md:col-span-3">
             <TiptapRenderer 
                jsonContent={row.content}
                className="prose prose-sm sm:prose-base max-w-none font-body text-foreground/80"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
