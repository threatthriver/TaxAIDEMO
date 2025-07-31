'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';

import { analyzeTaxDocument, type AnalyzeTaxDocumentOutput } from '@/ai/flows/analyze-tax-document';
import LoadingState from '@/components/loading-state';
import AnalysisResultDisplay from '@/components/analysis-result';

// Helper to convert file to data URI
const fileToDataUri = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

export default function TaxPlannerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [country, setCountry] = useState('United States');
    const [analysisType, setAnalysisType] = useState('Individual / Personal');
    const [analysisResult, setAnalysisResult] = useState<AnalyzeTaxDocumentOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };
    
    const resetState = () => {
        setFile(null);
        setFileName('');
        setAnalysisResult(null);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please upload a file first.',
            });
            return;
        }
        setLoading(true);
        setAnalysisResult(null);

        try {
            const fileDataUri = await fileToDataUri(file);

            const result = await analyzeTaxDocument({
                fileDataUri,
                country,
                analysisType,
            });

            setAnalysisResult(result);
        } catch (err: any) {
             toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: err.message || 'An unknown error occurred. Please try a different document or check the file format.',
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    if (analysisResult) {
        return <AnalysisResultDisplay result={analysisResult} onReset={resetState} />;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-12">
            <Card className="max-w-4xl mx-auto shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Comprehensive Tax Analysis Suite</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">Upload your financial documents and let our AI do the work.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <Label className="text-lg font-bold">1. Select Country</Label>
                            <Select value={country} onValueChange={setCountry}>
                                <SelectTrigger className="w-full h-12 text-base">
                                    <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="India">India</SelectItem>
                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                             <Label className="text-lg font-bold">2. Upload Document</Label>
                            <Label htmlFor="file-upload" className="relative cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="h-10 w-10 mb-3 text-gray-400" />
                                    {fileName ? (
                                        <p className="text-base font-semibold text-green-600">{fileName}</p>
                                    ) : (
                                        <>
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500">PDF, PNG, JPG, JPEG</p>
                                        </>
                                    )}
                                </div>
                                <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
                            </Label>
                        </div>

                        <div className="space-y-2">
                             <Label className="text-lg font-bold">3. Select Analysis Type</Label>
                            <Select value={analysisType} onValueChange={setAnalysisType}>
                                 <SelectTrigger className="w-full h-12 text-base">
                                    <SelectValue placeholder="Select analysis type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Individual / Personal">Individual / Personal</SelectItem>
                                    <SelectItem value="Small Business / LLC">Small Business / LLC</SelectItem>
                                    <SelectItem value="Corporation">Corporation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 text-center">
                            <Button type="submit" size="lg" className="w-full max-w-sm text-lg py-7" disabled={loading || !file}>
                                Generate My Tax Plan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
