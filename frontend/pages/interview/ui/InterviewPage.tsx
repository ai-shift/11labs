import { useState, useEffect } from "react";
import { VoiceInputTranscriber } from "features/voice-input";

export function InterviewPage() {
    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6 text-center">
                <h1 className="text-4xl font-bold text-gray-900">
                    Tell Us About Yourself
                </h1>

                <p className="text-xl text-gray-700">
                    Tell us your name, interests, and topics you'd like to follow.
                </p>
                
                <p className="text-sm text-gray-500">
                    Try saying something like: "My name is John and my interests are technology and science"
                </p>

                <VoiceInputTranscriber />
            </div>
        </div>
    )
}
