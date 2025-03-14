import { Volumelevelindictor } from "./VolumeLevelIndicator";
import { ToggleRecordingButton } from "./ToggleRecordingButton";
import { ProcessingAudioInfo } from "./ProcessingAudioInfo";
import { AudioRecordingStatus } from "./AudioRecordingStatus";

export function VoiceInputTranscriber() {
    return (
        {isProcessing ? (
            <ProcessingAudioInfo />
        ) : (
          <div className="space-y-8">
              {idRecording && <VolumeLevelIndictor />}

              <ToggleRecordingButton />

              <AudioRecordingStatus />
          </div>
        )}
    )
}
