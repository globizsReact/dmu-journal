
'use client';

import type { EditorialBoardMember } from '@/lib/types';
import Image from 'next/image';

interface EditorialBoardViewProps {
  members: EditorialBoardMember[];
  pageTitle: string;
}

const EditorialBoardCard = ({ member }: { member: EditorialBoardMember }) => (
  <div className="flex flex-col sm:flex-row items-start gap-6 text-left">
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-full sm:rounded-lg overflow-hidden bg-muted shadow-md self-center sm:self-start">
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

export default function EditorialBoardView({ members, pageTitle }: EditorialBoardViewProps) {
    if (!members) {
        return (
             <div className="py-8">
                <h2 className="text-2xl font-headline font-bold text-primary mb-6">{pageTitle}</h2>
                <p className="text-muted-foreground">Loading editorial board...</p>
            </div>
        )
    }
  
    if (members.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-headline font-bold text-primary mb-6">{pageTitle}</h2>
        <p className="text-muted-foreground">The editorial board for this journal has not been established yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
        <h2 className="text-2xl font-headline font-bold text-primary">{pageTitle}</h2>
        {members.map(member => (
          <EditorialBoardCard key={member.id} member={member} />
        ))}
    </div>
  );
}
