export default function FallbackSkeleton() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 font-outfit">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-800" />
            </div>
        </div>
    );
}
