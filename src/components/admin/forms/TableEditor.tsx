
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableEditorProps {
  value: any;
  onChange: (value: TableData) => void;
  disabled?: boolean;
}

export default function TableEditor({ value, onChange, disabled }: TableEditorProps) {
  const [data, setData] = useState<TableData>({ headers: [''], rows: [['']] });

  useEffect(() => {
    if (value && Array.isArray(value.headers) && Array.isArray(value.rows)) {
      setData(value);
    } else {
      // Initialize with a default structure if value is invalid
      setData({ headers: ['Header 1'], rows: [['Cell 1']] });
    }
  }, [value]);

  const updateParent = (newData: TableData) => {
    setData(newData);
    onChange(newData);
  };

  const handleHeaderChange = (index: number, newHeader: string) => {
    const newHeaders = [...data.headers];
    newHeaders[index] = newHeader;
    updateParent({ ...data, headers: newHeaders });
  };

  const addColumn = () => {
    const newHeaders = [...data.headers, `Header ${data.headers.length + 1}`];
    const newRows = data.rows.map(row => [...row, '']);
    updateParent({ headers: newHeaders, rows: newRows });
  };

  const removeColumn = (index: number) => {
    if (data.headers.length <= 1) return;
    const newHeaders = data.headers.filter((_, i) => i !== index);
    const newRows = data.rows.map(row => row.filter((_, i) => i !== index));
    updateParent({ headers: newHeaders, rows: newRows });
  };

  const handleCellChange = (rowIndex: number, colIndex: number, newValue: string) => {
    const newRows = [...data.rows];
    newRows[rowIndex][colIndex] = newValue;
    updateParent({ ...data, rows: newRows });
  };

  const addRow = () => {
    const newRow = Array(data.headers.length).fill('');
    updateParent({ ...data, rows: [...data.rows, newRow] });
  };

  const removeRow = (index: number) => {
    if (data.rows.length <= 1 && data.headers.length <= 1) return;
     if (data.rows.length <= 1) {
        const newRows = [Array(data.headers.length).fill('')];
        updateParent({ ...data, rows: newRows });
        return;
    }
    const newRows = data.rows.filter((_, i) => i !== index);
    updateParent({ ...data, rows: newRows });
  };

  return (
    <div className="p-4 border rounded-md space-y-4 bg-muted/20">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {data.headers.map((header, colIndex) => (
                <TableHead key={colIndex}>
                  <div className="flex items-center gap-2 min-w-[200px]">
                    <Input
                      value={header}
                      onChange={(e) => handleHeaderChange(colIndex, e.target.value)}
                      placeholder={`Header ${colIndex + 1}`}
                      disabled={disabled}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                      onClick={() => removeColumn(colIndex)}
                      disabled={disabled || data.headers.length <= 1}
                      title="Remove column"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-right pr-2">
                <Button type="button" size="sm" onClick={addColumn} disabled={disabled}><Plus className="h-4 w-4 mr-1" /> Col</Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <TableCell key={colIndex}>
                    <Input
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      placeholder="Enter value"
                      disabled={disabled}
                    />
                  </TableCell>
                ))}
                <TableCell className="text-right pr-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeRow(rowIndex)}
                    disabled={disabled}
                    title="Remove row"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button type="button" variant="outline" onClick={addRow} disabled={disabled}><Plus className="h-4 w-4 mr-1" /> Add Row</Button>
    </div>
  );
}
