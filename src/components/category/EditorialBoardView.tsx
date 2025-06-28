
'use client';

import type { EditorialBoardMember } from '@/lib/types';
import Image from 'next/image';

interface EditorialBoardViewProps {
  members: EditorialBoardMember[];
}

const EditorialBoardCard = ({ member }: { member: EditorialBoardMember }) => (
  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-full sm:rounded-lg overflow-hidden bg-muted shadow-md">
      <Image
        src={member.avatarUrl || `https://placehold.co/200x200.png`}
        alt={`Portrait of ${member.fullName}`}
        fill
        sizes="(max-width: 640px) 33vw, 20vw"
        className="object-cover"
        data-ai-hint="portrait professional"
      />
    </div>
    <div className="flex-grow">
      <h3 className="text-xl font-headline font-bold text-primary">{member.fullName}</h3>
      <p className="font-semibold text-foreground/80 mt-1">Article Number - {member.articleNumber}</p>
      <div className="mt-2 text-sm text-muted-foreground space-y-1">
        <p>
            <span className="font-semibold text-foreground/70">Journal Of</span><br />
            {member.journalName}
        </p>
        <p className="pt-2">
            {member.affiliation}
        </p>
      </div>
    </div>
  </div>
);

export default function EditorialBoardView({ members }: EditorialBoardViewProps) {
  if (!members || members.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">
          Editorial Board
        </h2>
        <p className="text-muted-foreground">The editorial board for this journal has not been established yet.</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-12 text-center">
        Editorial Board
      </h2>
      <div className="max-w-3xl mx-auto space-y-12">
        {members.map(member => (
          <EditorialBoardCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
