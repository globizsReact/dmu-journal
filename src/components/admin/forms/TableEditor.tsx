
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import TiptapEditor from './TiptapEditor';
import type { JSONContent } from '@tiptap/core';

interface RequirementRow {
  heading: string;
  content: JSONContent;
}

interface TableEditorProps {
  value: any;
  onChange: (value: RequirementRow[]) => void;
  disabled?: boolean;
}

const defaultContent: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

export default function TableEditor({ value, onChange, disabled }: TableEditorProps) {
  const [rows, setRows] = useState<RequirementRow[]>([]);

  useEffect(() => {
    if (Array.isArray(value) && value.length > 0 && value.every(item => 'heading' in item && 'content' in item)) {
      setRows(value);
    } else {
      // Initialize with a default structure if value is invalid or empty
      setRows([{ heading: '', content: defaultContent }]);
    }
  }, [value]);

  const updateParent = (newRows: RequirementRow[]) => {
    setRows(newRows);
    onChange(newRows);
  };

  const handleHeadingChange = (index: number, newHeading: string) => {
    const newRows = [...rows];
    newRows[index].heading = newHeading;
    updateParent(newRows);
  };
  
  const handleContentChange = (index: number, newContent: JSONContent) => {
    const newRows = [...rows];
    newRows[index].content = newContent;
    updateParent(newRows);
  };

  const addRow = () => {
    const newRows = [...rows, { heading: 'New Requirement', content: defaultContent }];
    updateParent(newRows);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    const newRows = rows.filter((_, i) => i !== index);
    updateParent(newRows);
  };

  return (
    <div className="space-y-4 rounded-md border p-4">
      {rows.map((row, index) => (
        <div key={index} className="rounded-lg border bg-muted/50 p-4 space-y-4 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => removeRow(index)}
            disabled={disabled || rows.length <= 1}
            title="Remove this requirement"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="space-y-2">
            <label className="text-sm font-medium">Heading</label>
            <Input
              value={row.heading}
              onChange={(e) => handleHeadingChange(index, e.target.value)}
              placeholder="e.g., Manuscript Title"
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Content</label>
            <TiptapEditor
                content={row.content}
                onChange={(content) => handleContentChange(index, content)}
                isSubmitting={!!disabled}
            />
          </div>
        </div>
      ))}
       <Button type="button" variant="outline" onClick={addRow} disabled={disabled} className="border-dashed">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Requirement
      </Button>
    </div>
  );
}
