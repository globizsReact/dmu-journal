
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingAdminSettingsPage() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader><Skeleton className="h-7 w-48 mb-1" /><Skeleton className="h-4 w-64" /></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                        </div>
                        <div className="flex justify-center md:justify-start">
                             <Skeleton className="h-32 w-32 rounded-full" />
                        </div>
                    </div>
                     <div className="pt-6 border-t mt-6"><Skeleton className="h-10 w-32" /></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-7 w-48 mb-1" /><Skeleton className="h-4 w-64" /></CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="pt-6 border-t mt-6"><Skeleton className="h-10 w-40" /></div>
                </CardContent>
            </Card>
        </div>
    );
}
