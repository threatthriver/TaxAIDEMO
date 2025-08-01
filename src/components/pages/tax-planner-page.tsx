
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, XCircle, File as FileIcon, Landmark, TrendingDown, PiggyBank, Handshake, CalendarDays } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import dynamic from 'next/dynamic';

import { analyzeTaxDocument, type AnalyzeTaxDocumentOutput } from '@/ai/flows/analyze-tax-document';

const LoadingState = dynamic(() => import('@/components/loading-state'));
const AnalysisResultDisplay = dynamic(() => import('@/components/analysis-result'));

// Helper to convert file to data URI
const fileToDataUri = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

export default function TaxPlannerPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [country, setCountry] = useState('United States');
    const [analysisType, setAnalysisType] = useState('Individual / Personal');
    const [taxYear, setTaxYear] = useState(new Date().getFullYear().toString());
    const [additionalNotes, setAdditionalNotes] = useState('');
    
    // State for new structured data fields
    const [employmentIncome, setEmploymentIncome] = useState('');
    const [investmentIncome, setInvestmentIncome] = useState('');
    const [retirementContributions, setRetirementContributions] = useState('');
    const [mortgageInterest, setMortgageInterest] = useState('');
    const [charitableDonations, setCharitableDonations] = useState('');
    const [studentLoanInterest, setStudentLoanInterest] = useState('');
    const [otherDeductions, setOtherDeductions] = useState('');
    const [businessRevenue, setBusinessRevenue] = useState('');
    const [businessExpenses, setBusinessExpenses] = useState('');
    const [rentalIncome, setRentalIncome] = useState('');
    const [rentalExpenses, setRentalExpenses] = useState('');

    const [analysisResult, setAnalysisResult] = useState<AnalyzeTaxDocumentOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };
    
    const resetState = () => {
        setFiles([]);
        setAnalysisResult(null);
        setLoading(false);
        setAdditionalNotes('');
        setEmploymentIncome('');
        setInvestmentIncome('');
        setRetirementContributions('');
        setMortgageInterest('');
        setCharitableDonations('');
        setStudentLoanInterest('');
        setOtherDeductions('');
        setBusinessRevenue('');
        setBusinessExpenses('');
        setRentalIncome('');
        setRentalExpenses('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setAnalysisResult(null);

        try {
            const fileDataUris = await Promise.all(files.map(fileToDataUri));

            const result = await analyzeTaxDocument({
                fileDataUris,
                country,
                analysisType,
                taxYear,
                additionalNotes,
                incomeAndInvestments: {
                    employmentIncome,
                    investmentIncome,
                    retirementContributions
                },
                deductionsAndCredits: {
                    mortgageInterest,
                    charitableDonations,
                    studentLoanInterest,
                    otherDeductions
                },
                businessAndRental: {
                    businessRevenue,
                    businessExpenses,
                    rentalIncome,
                    rentalExpenses
                }
            });

            setAnalysisResult(result);
        } catch (err: any) {
             toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: err.message || 'An unknown error occurred. Please try different documents or check the file formats.',
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
        <div className="bg-background min-h-[calc(100vh-80px)] py-12">
            <div className="container mx-auto px-4 sm:px-6">
                <Card className="max-w-4xl mx-auto shadow-2xl border-t-4 border-primary bg-card">
                    <CardHeader className="text-center p-8">
                        <CardTitle className="text-3xl font-bold">Client Data Questionnaire</CardTitle>
                        <CardDescription className="text-lg text-muted-foreground pt-2">Provide structured data and/or upload documents for a comprehensive tax plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-3 gap-6">
                               <div className="space-y-2">
                                    <Label className="text-base font-semibold">1. Country</Label>
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
                                     <Label className="text-base font-semibold">2. Analysis Type</Label>
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
                                 <div className="space-y-2">
                                     <Label htmlFor="taxYear" className="text-base font-semibold flex items-center gap-2"><CalendarDays className="h-4 w-4"/>3. Tax Year</Label>
                                     <Input id="taxYear" className="h-12 text-base" placeholder="e.g., 2023" value={taxYear} onChange={e => setTaxYear(e.target.value)} />
                                 </div>
                            </div>
                            
                            <div className="space-y-2">
                                 <Label className="text-base font-semibold">4. Financial Details (Optional)</Label>
                                 <p className="text-sm text-muted-foreground">The more details you provide, the better the analysis. You can still upload documents below.</p>
                                 <Accordion type="multiple" className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-lg font-medium"><PiggyBank className="mr-2 h-5 w-5 text-primary"/>Income & Investments</AccordionTrigger>
                                        <AccordionContent className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-b-lg">
                                            <div className="space-y-2">
                                                <Label htmlFor="employmentIncome">Total Employment Income</Label>
                                                <Input id="employmentIncome" placeholder="$80,000" value={employmentIncome} onChange={e => setEmploymentIncome(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="investmentIncome">Investment Income (Dividends, Gains)</Label>
                                                <Input id="investmentIncome" placeholder="$5,000" value={investmentIncome} onChange={e => setInvestmentIncome(e.target.value)} />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="retirementContributions">Retirement Contributions (401k, IRA)</Label>
                                                <Input id="retirementContributions" placeholder="$12,000" value={retirementContributions} onChange={e => setRetirementContributions(e.target.value)} />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="text-lg font-medium"><TrendingDown className="mr-2 h-5 w-5 text-primary"/>Deductions & Credits</AccordionTrigger>
                                        <AccordionContent className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-b-lg">
                                            <div className="space-y-2">
                                                <Label htmlFor="mortgageInterest">Mortgage Interest Paid</Label>
                                                <Input id="mortgageInterest" placeholder="$15,000" value={mortgageInterest} onChange={e => setMortgageInterest(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="charitableDonations">Charitable Donations</Label>
                                                <Input id="charitableDonations" placeholder="$2,500" value={charitableDonations} onChange={e => setCharitableDonations(e.target.value)} />
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="studentLoanInterest">Student Loan Interest Paid</Label>
                                                <Input id="studentLoanInterest" placeholder="$2,000" value={studentLoanInterest} onChange={e => setStudentLoanInterest(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="otherDeductions">Other Major Deductions</Label>
                                                <Input id="otherDeductions" placeholder="e.g., Medical expenses" value={otherDeductions} onChange={e => setOtherDeductions(e.target.value)} />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger className="text-lg font-medium"><Landmark className="mr-2 h-5 w-5 text-primary"/>Business & Rental Income</AccordionTrigger>
                                        <AccordionContent className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-b-lg">
                                             <div className="space-y-2">
                                                <Label htmlFor="businessRevenue">Gross Business Revenue</Label>
                                                <Input id="businessRevenue" placeholder="$150,000" value={businessRevenue} onChange={e => setBusinessRevenue(e.target.value)} />
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="businessExpenses">Total Business Expenses</Label>
                                                <Input id="businessExpenses" placeholder="$90,000" value={businessExpenses} onChange={e => setBusinessExpenses(e.target.value)} />
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="rentalIncome">Gross Rental Income</Label>
                                                <Input id="rentalIncome" placeholder="$24,000" value={rentalIncome} onChange={e => setRentalIncome(e.target.value)} />
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="rentalExpenses">Total Rental Expenses</Label>
                                                <Input id="rentalExpenses" placeholder="$18,000" value={rentalExpenses} onChange={e => setRentalExpenses(e.target.value)} />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                 </Accordion>
                            </div>

                            <div className="space-y-4">
                                 <Label className="text-base font-semibold">5. Upload Documents (Optional)</Label>
                                 <p className="text-sm text-muted-foreground">Supplement the data above by uploading documents. Our AI supports multi-year analysis if you upload files from different years.</p>
                                <Label htmlFor="file-upload" className="relative cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="h-10 w-10 mb-3 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PDF, PNG, JPG, JPEG (multiple files allowed)</p>
                                    </div>
                                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" multiple />
                                </Label>
                                 {files.length > 0 && (
                                    <div className="space-y-2 pt-2">
                                        <h4 className="font-semibold text-muted-foreground">Selected Files:</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {files.map((file, index) => (
                                                <li key={index} className="flex items-center justify-between bg-secondary p-2 rounded-md border">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                        <span className="truncate text-sm">{file.name}</span>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(index)}>
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="additional-notes" className="text-base font-semibold">6. Additional Notes & "What-If" Scenarios (Optional)</Label>
                              <Textarea
                                  id="additional-notes"
                                  placeholder="e.g., What if I contributed an extra $5,000 to my retirement account? or I'm starting a side business, what should I consider?"
                                  value={additionalNotes}
                                  onChange={(e) => setAdditionalNotes(e.target.value)}
                                  className="min-h-[100px] text-base"
                              />
                            </div>

                            <div className="pt-4 text-center">
                                <Button type="submit" size="lg" className="w-full max-w-sm text-lg py-7" disabled={loading}>
                                    <Handshake className="mr-2"/> Create My Tax Plan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
