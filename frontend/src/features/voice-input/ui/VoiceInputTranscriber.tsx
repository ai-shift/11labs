import { AudioRecordingStatus } from "./AudioRecordingStatus";
import { ProcessingAudioInfo } from "./ProcessingAudioInfo";
import { ToggleRecordingButton } from "./ToggleRecordingButton";
import { VolumeLevelIndicator } from "./VolumeLevelIndicator";

interface VoiceInputTranscriberProps {
  isProcessing: boolean;
  idRecording: boolean;
}

export function VoiceInputTranscriber({
  isProcessing,
  idRecording,
}: VoiceInputTranscriberProps) {
  return (
    <>
      {isProcessing ? (
        <ProcessingAudioInfo />
      ) : (
        <div className="space-y-8">
          {idRecording && <VolumeLevelIndicator />}
          <ToggleRecordingButton />
          <AudioRecordingStatus />
        </div>
      )}
    </>
  );
}
