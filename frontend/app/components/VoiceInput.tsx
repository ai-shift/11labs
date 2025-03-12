"use client"

import { useVoiceRecording } from "../hooks/useVoiceRecording"
import { useEffect, useState } from "react"
import { apiClient } from "../lib/api/client"

interface VoiceInputProps {
  onComplete?: (userData: {
    name: string
    interests: string[]
    topicsToFollow: string[]
  }) => void
}

export default function VoiceInput({ onComplete }: VoiceInputProps) {
  const {
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording
  } = useVoiceRecording()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)

  useEffect(() => {
    if (transcript && !isRecording) {
      handleTranscriptProcessing();
    }
  }, [transcript, isRecording]);

  const handleTranscriptProcessing = async () => {
    setIsProcessing(true);
    setProcessingError(null);

    try {
      // Step 1: Initialize session first
      console.log('Initializing session...');
      const sessionResponse = await apiClient.initSession();
      if (!sessionResponse.success) {
        throw new Error('Failed to initialize session');
      }
      console.log('Session initialized successfully');

      // Step 2: Set topics
      console.log('Setting topics with transcript:', transcript);
      const topicsResponse = await apiClient.setTopics(transcript);
      if (!topicsResponse.success) {
        throw new Error('Failed to set topics');
      }
      console.log('Topics set successfully');

      // Parse user data from transcript
      const userData = {
        name: transcript.split('name is ')[1]?.split(' ')[0] || 'Unknown',
        interests: transcript.toLowerCase()
          .split('interests are ')[1]?.split(' and ')
          .map(i => i.trim()) || [],
        topicsToFollow: transcript.toLowerCase()
          .split('interests are ')[1]?.split(' and ')
          .map(i => i.trim()) || [],
      };

      console.log('Parsed user data:', userData);
      setShowSuccess(true);
      
      // Wait for animation before completing
      setTimeout(() => {
        if (onComplete) {
          onComplete(userData);
        }
      }, 2000);

    } catch (err) {
      console.error('Processing error:', err);
      setProcessingError('Failed to process your information. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Success!</h2>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gray-900 h-2 rounded-full w-full"></div>
          </div>
          <p className="text-gray-700">Your profile has been created.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Tell Us About Yourself</h1>
        
        <p className="text-xl text-gray-700">
          Tell us your name, interests, and topics you'd like to follow.
        </p>
        <p className="text-sm text-gray-500">
          Try saying something like: "My name is John and my interests are technology and science"
        </p>

        {isProcessing ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Processing Your Information</h2>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-900 h-2 rounded-full transition-all duration-300 ease-out animate-[progress_2s_ease-in-out]" style={{ width: '50%' }}></div>
            </div>
            <p className="text-gray-700">Processing your information...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Volume Level Indicator */}
            {isRecording && (
              <div className="w-32 h-2 mx-auto bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 transition-all duration-100"
                  
                />
              </div>
            )}
            
            {/* Main Record Button */}
            <div className="relative w-32 h-32 mx-auto">
              <button
                className={`w-full h-full rounded-full ${
                  isRecording ? "bg-gray-900" : "bg-gray-700"
                } text-white hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center`}
                onClick={startRecording}
                disabled={isProcessing || isRecording}
              >
                <svg
                  className={`h-12 w-12 ${isRecording ? "animate-pulse" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
            </div>

            {/* Stop Button - Moved outside the relative container */}
            {isRecording && (
              <div className="mt-8">
                <button
                  onClick={stopRecording}
                  className="px-8 py-3 bg-red-500 text-white text-lg font-medium rounded-full hover:bg-red-600 transition-colors shadow-md"
                >
                  Stop Recording
                </button>
              </div>
            )}

            {(error || processingError) && (
              <div className="text-red-500 text-center animate-fade-in mt-4">
                {error || processingError}
              </div>
            )}

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

            {transcript && !isRecording && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg animate-fade-in">
                <p className="text-gray-900">{transcript}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

