export function AudioRecordingStatus() {
  return (
    <div className="space-y-2">
      <p className="text-gray-600">
        {isRecording
          ? "We're listening... Tell us about yourself."
          : "Click the microphone to begin recording"}
      </p>
      {isRecording && (
        <p className="text-sm text-gray-500">
          Press the Stop button when you're finished speaking
        </p>
      )}
    </div>
  );
}
