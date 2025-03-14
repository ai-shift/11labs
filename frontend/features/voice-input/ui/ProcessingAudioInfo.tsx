export function ProcessingAudioInfo() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
                Processing Your Information
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="width-1/2 bg-gray-900 h-2 rounded-full transition-all duration-300 ease-out animate-[progress_2s_ease-in-out]"
                ></div>
            </div>
            <p className="text-gray-700">Processing your information...</p>
        </div>
    )
}
