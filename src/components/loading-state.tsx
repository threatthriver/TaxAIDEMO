export default function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[60vh] bg-background">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            <h2 className="mt-6 text-2xl font-semibold text-foreground">Analyzing Your Documents...</h2>
            <p className="text-muted-foreground max-w-md text-center mt-2">Our AI is reading your files, identifying key figures, and preparing your personalized tax-saving strategies. This may take a moment.</p>
        </div>
    );
}
