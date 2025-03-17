import { AudioRecordingStatus } from "./AudioRecordingStatus";
import { ProcessingAudioInfo } from "./ProcessingAudioInfo";
import { ToggleRecordingButton } from "./ToggleRecordingButton";
import { Volumelevelindictor } from "./VolumeLevelIndicator";

interface VoiceInputTranscriberProps {
  isProcessing: boolean;
  idRecording: boolean;
}

export function VoiceInputTranscriber({
  isProcessing,
  idRecording,
}: VoiceInputTranscriberProps) {
  isProcessing = 5;
  return (
    <>
      {isProcessing ? (
        <ProcessingAudioInfo />
      ) : (
        <div className="space-y-8">
          {idRecording && <VolumeLevelIndictor />}
          <ToggleRecordingButton />
          <AudioRecordingStatus />
        </div>
      )}
    </>
  );
}
