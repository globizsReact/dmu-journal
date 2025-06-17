"use client";

import { Button } from '@/components/ui/button';

interface ViewFiltersProps {
  selectedView: string | null;
  onSelectView: (view: string | null) => void;
}

const viewOptions = ["Most Recent", "Most View", "Most Shared"];

const ViewFilters = ({ selectedView, onSelectView }: ViewFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-8">
      <span className="text-md font-medium text-foreground mr-2">View:</span>
      {viewOptions.map((view) => (
        <Button
          key={view}
          variant={selectedView === view ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectView(view)}
          className={`transition-all duration-200 ${selectedView === view ? 'bg-primary text-primary-foreground scale-105' : 'hover:bg-accent/20'}`}
          aria-pressed={selectedView === view}
        >
          {view}
        </Button>
      ))}
    </div>
  );
};

export default ViewFilters;
