import { Volumelevelindictor } from "./VolumeLevelIndicator";
import { ToggleRecordingButton } from "./ToggleRecordingButton";
import { ProcessingAudioInfo } from "./ProcessingAudioInfo";
import { AudioRecordingStatus } from "./AudioRecordingStatus";

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
          {idRecording && <VolumeLevelIndictor />}
          <ToggleRecordingButton />
          <AudioRecordingStatus />
        </div>
      )}
    </>
  );
}
