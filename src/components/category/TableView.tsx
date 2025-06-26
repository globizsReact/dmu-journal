
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableViewProps {
  content: any;
}

export default function TableView({ content }: TableViewProps) {
  if (!content || !Array.isArray(content.headers) || !Array.isArray(content.rows)) {
    return <p className="text-muted-foreground">Table data is not correctly formatted.</p>;
  }

  const { headers, rows } = content as TableData;

  return (
    <div className="py-8 prose lg:prose-xl max-w-none font-body">
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              {headers.map((header, index) => (
                <TableHead key={index} className="font-semibold text-foreground">{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="even:bg-card odd:bg-muted/40">
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="text-foreground/90">{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
