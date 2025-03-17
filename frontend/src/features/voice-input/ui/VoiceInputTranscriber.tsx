import { Volumelevelindictor } from "./VolumeLevelIndicator";
import { ToggleRecordingButton } from "./ToggleRecordingButton";
import { ProcessingAudioInfo } from "./ProcessingAudioInfo";
import { AudioRecordingStatus } from "./AudioRecordingStatus";

interface VoiceInputTranscriberProps {
  isProcessing: boolean;
  idRecording: boolean;
  ProcessingAudioInfo: React.ComponentType<any>;
  VolumeLevelIndictor: React.ComponentType<any>;
  ToggleRecordingButton: React.ComponentType<any>;
  AudioRecordingStatus: React.ComponentType<any>;
}

export function VoiceInputTranscriber({
  isProcessing,
  idRecording,
  ProcessingAudioInfo,
  VolumeLevelIndictor,
  ToggleRecordingButton,
  AudioRecordingStatus,
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
