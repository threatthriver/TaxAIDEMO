export default function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            <h2 className="mt-6 text-2xl font-semibold text-gray-700">Analyzing Document...</h2>
            <p className="text-gray-500 max-w-md text-center">Our AI is reading your file and identifying savings. This may take a moment.</p>
        </div>
    );
}
