
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useHistory } from '@/hooks/use-history';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AnalysisResultDisplay = dynamic(() => import('@/components/analysis-result'));
const LoadingState = dynamic(() => import('@/components/loading-state'));

export default function ReportDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { getReportById } = useHistory();
    const [report, setReport] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    const id = params.id as string;

    useEffect(() => {
        setIsMounted(true);
        if (id) {
            const foundReport = getReportById(id);
            setReport(foundReport);
        }
    }, [id, getReportById]);

    if (!isMounted) {
        return <LoadingState />;
    }

    if (!report) {
        return (
             <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
                <Card className="max-w-lg mx-auto">
                    <CardHeader>
                        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4"/>
                        <CardTitle className="text-2xl text-destructive">Report Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>The report you are looking for does not exist or has been deleted.</CardDescription>
                        <Button onClick={() => router.push('/history')} className="mt-6">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to History
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return <AnalysisResultDisplay result={report.result} onReset={() => router.push('/planner')} />;
}

