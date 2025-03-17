interface ToggleRecordingButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  startRecoridng: () => void;
  stopRecording: () => void;
}

export function ToggleRecordingButton({
  isRecording,
  isProcessing,
  startRecoridng,
  stopRecording,
}: ToggleRecordingButtonProps) {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <button
        type="button"
        className={clsx(
          "w-full h-full rounded-full text-white hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center",
          {
            "bg-gray-900": isRecording,
            "bg-gray-700": !isRecording,
          },
        )}
        onClick={startRecording}
        disabled={isProcessing || isRecording}
      >
        <svg
          className={clsx("h-12 w-12", {
            "animate-pulse": isRecording,
          })}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <title>Start recording</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
      {isRecording && (
        <div className="absolute -inset-2 rounded-full border-4 border-gray-400 animate-ping pointer-events-none" />
      )}
      {isRecording && (
        <div className="mt-8">
          <button
            type="button"
            onClick={stopRecording}
            className="px-8 py-3 bg-red-500 text-white text-lg font-medium rounded-full hover:bg-red-600 transition-colors shadow-md"
          >
            Stop Recording
          </button>
        </div>
      )}
    </div>
  );
}
