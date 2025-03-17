"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Mic } from "lucide-react";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { AudioStreamingClient } from "@/lib/api/audio";

interface AudioPlaybackProps {
  onClose: () => void;
}

export default function AudioPlayback({ onClose }: AudioPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVoiceCommandActive, setIsVoiceCommandActive] = useState(false);
  const [streamingState, setStreamingState] = useState<
    "connecting" | "streaming" | "stopped" | "error"
  >("stopped");
  const audioClientRef = useRef<AudioStreamingClient | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    isRecording,
    transcript,
    error: recordingError,
    startRecording,
    stopRecording,
  } = useVoiceRecording();

  useEffect(() => {
    audioClientRef.current = new AudioStreamingClient(setStreamingState);
    return () => {
      if (audioClientRef.current) {
        audioClientRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (transcript && !isRecording) {
      handleFlowCommand(transcript);
    }
  }, [transcript, isRecording]);

  const handleFlowCommand = async (command: string) => {
    console.log("Sending flow command:", command);
    try {
      if (audioClientRef.current) {
        audioClientRef.current.sendFlowCommand(command);
      }
    } catch (err) {
      console.error("Flow command error:", err);
    } finally {
      setIsVoiceCommandActive(false);
    }
  };

  const handleVoiceCommand = () => {
    setIsVoiceCommandActive(true);
    startRecording();
  };

  const togglePlayback = () => {
    if (audioClientRef.current) {
      if (isPlaying) {
        audioClientRef.current.disconnect();
        setIsPlaying(false);
      } else {
        audioClientRef.current.connect();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Now Playing</h2>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <canvas
            ref={canvasRef}
            className="w-full h-16 bg-gray-100 rounded-lg"
          />

          <div className="flex justify-center items-center gap-8 mt-8">
            {/* Play/Pause Button */}
            <div className="relative w-24 h-24">
              <button
                onClick={togglePlayback}
                className={`w-full h-full rounded-full ${
                  isPlaying ? "bg-red-500" : "bg-green-400"
                } text-white hover:opacity-90 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center`}
              >
                {isPlaying ? (
                  <span className="text-2xl">⏸</span>
                ) : (
                  <span className="text-2xl">▶️</span>
                )}
              </button>
            </div>

            {/* Voice Command Button */}
            <div className="relative w-24 h-24">
              <button
                onClick={
                  isVoiceCommandActive ? stopRecording : handleVoiceCommand
                }
                className={`w-full h-full rounded-full ${
                  isVoiceCommandActive ? "bg-red-500" : "bg-gray-200"
                } text-white hover:opacity-90 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center`}
              >
                <Mic className="h-8 w-8" />
              </button>
              {isVoiceCommandActive && isRecording && (
                <div className="absolute -inset-2 rounded-full border-4 border-gray-400 animate-ping pointer-events-none" />
              )}
            </div>
          </div>

          {recordingError && (
            <p className="text-red-500 text-sm text-center">{recordingError}</p>
          )}

          {isVoiceCommandActive && (
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                {isRecording ? "Listening for command..." : "Processing..."}
              </p>
              {transcript && (
                <p className="text-xs text-gray-500">{transcript}</p>
              )}
            </div>
          )}

          {/* Streaming State Indicator */}
          <div className="text-center text-sm text-gray-600">
            {streamingState === "connecting" && "Connecting to audio stream..."}
            {streamingState === "streaming" && "Streaming audio..."}
            {streamingState === "error" && "Error connecting to audio stream"}
          </div>
        </div>
      </div>
    </div>
  );
}
