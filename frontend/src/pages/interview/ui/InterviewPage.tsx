import { VoiceInputTranscriber } from "features/voice-input";
import { useState } from "react";

type InterviewInputType = "voice" | "text";

export function InterviewPage() {
  const [interviewInput, setIntreviewInput] = useState("voice");

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Tell Us About Yourself
        </h1>

        <p className="text-sm text-gray-500">
          Try saying something like: "My name is John and my interests are
          technology and science"
        </p>

        {interviewInput === "voice" ? (
          <>
            <VoiceInputTranscriber />
            <button
              className="text-color-blue-500"
              type="button"
              onClick={() => setIntreviewInput("text")}>
              Input as text
            </button>
          </>
        ) : (
          <>
            <input />
            <button type="button" onClick={() => setIntreviewInput("voice")}>
              Input as voice
            </button>
          </>
        )}
      </div>
    </div>
  );
}
