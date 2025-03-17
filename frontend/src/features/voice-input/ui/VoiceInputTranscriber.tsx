import { useVoiceRecording } from "../hooks/useVoiceRecording";
import { AudioRecordingStatus } from "./AudioRecordingStatus";
import { ProcessingAudioInfo } from "./ProcessingAudioInfo";
import { ToggleRecordingButton } from "./ToggleRecordingButton";
import { VolumeLevelIndicator } from "./VolumeLevelIndicator";

export function VoiceInputTranscriber() {
  const {
    isRecording,
    isProcessing,
    transcript,
    error,
    volumeLevel,
    startRecording,
    stopRecording,
  } = useVoiceRecording();

  return (
    <>
      {isProcessing ? (
        <ProcessingAudioInfo />
      ) : (
        <div className="space-y-8">
          {isRecording && <VolumeLevelIndicator />}
          <ToggleRecordingButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
          <AudioRecordingStatus isRecording={isRecording} />
        </div>
      )}
    </>
  );
}
