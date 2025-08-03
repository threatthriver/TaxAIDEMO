
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHistory, type Report } from '@/hooks/use-history';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History as HistoryIcon, Eye, Trash2, Edit, AlertTriangle, PlusCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';

const parseSavings = (savings: string): number => {
    const cleanedString = savings.replace(/[$,₹€£]/g, '').replace(/,/g, '');
    const numbers = cleanedString.split('-').map(s => parseFloat(s.trim()));
    if (numbers.length > 1) {
      return (numbers[0] + numbers[1]) / 2;
    }
    if (numbers.length === 1 && !isNaN(numbers[0])) {
      return numbers[0];
    }
    return 0;
};


export default function HistoryPage() {
    const { reports, deleteReport, updateReportName } = useHistory();
    const [isMounted, setIsMounted] = useState(false);
    const [editingReportId, setEditingReportId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleViewReport = (report: Report) => {
        router.push(`/history/${report.id}`);
    };

    const handleStartEdit = (report: Report) => {
        setEditingReportId(report.id);
        setNewName(report.name);
    };

    const handleSaveName = (reportId: string) => {
        if (newName.trim()) {
            updateReportName(reportId, newName.trim());
        }
        setEditingReportId(null);
        setNewName('');
    };
    
    if (!isMounted) {
        return null;
    }

    const sortedReports = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="bg-background min-h-screen py-20 md:py-32">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 flex items-center justify-center gap-3">
                        <HistoryIcon className="w-10 h-10" /> Report History
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Review, rename, or delete your past analysis reports.
                    </p>
                </div>

                {sortedReports.length === 0 ? (
                    <Card className="text-center p-12 max-w-2xl mx-auto shadow-lg animate-fade-in-up">
                        <CardHeader>
                            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <CardTitle className="text-2xl">No Reports Found</CardTitle>
                            <CardDescription className="text-lg">You haven't generated any tax plans yet.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button size="lg" onClick={() => router.push('/planner')}>
                                <PlusCircle className="mr-2" /> Create Your First Plan
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {sortedReports.map((report, index) => {
                             const totalSavings = report.result.strategies.reduce((acc, strategy) => acc + parseSavings(strategy.potentialSavings), 0);
                             
                             return (
                            <Card key={report.id} className="flex flex-col md:flex-row items-center justify-between p-6 shadow-md hover:shadow-xl transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="flex-1 mb-4 md:mb-0">
                                    {editingReportId === report.id ? (
                                        <div className="flex items-center gap-2">
                                            <Input 
                                                value={newName} 
                                                onChange={(e) => setNewName(e.target.value)} 
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveName(report.id)}
                                                className="h-9"
                                            />
                                            <Button size="sm" onClick={() => handleSaveName(report.id)}>Save</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingReportId(null)}>Cancel</Button>
                                        </div>
                                    ) : (
                                        <h2 className="text-xl font-bold text-primary cursor-pointer hover:underline" onClick={() => handleViewReport(report)}>{report.name}</h2>
                                    )}
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Generated on {format(parseISO(report.createdAt), 'MMMM d, yyyy')} - {report.inputs.analysisType} ({report.inputs.taxYear})
                                    </p>
                                    <p className="text-sm font-semibold text-green-600 mt-1">
                                        Potential Savings: ~${totalSavings.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}><Eye className="mr-2 h-4 w-4"/>View</Button>
                                    <Button variant="outline" size="sm" onClick={() => handleStartEdit(report)}><Edit className="mr-2 h-4 w-4"/>Rename</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete this report from your browser's storage.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteReport(report.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </Card>
                        )})}
                    </div>
                )}
            </div>
        </div>
    );
}
