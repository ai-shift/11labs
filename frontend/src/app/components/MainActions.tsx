"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Mic, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioPlayback from "./AudioPlayback";
import { apiClient } from "../lib/api/client";

enum DigestState {
  Preparing = 0,
  AlmostReady = 1,
  Ready = 2,
}

export default function MainActions() {
  const [digestState, setDigestState] = useState<DigestState>(
    DigestState.Preparing,
  );
  const [digestTopic, setDigestTopic] = useState<string>("");
  const [showAudioPlayback, setShowAudioPlayback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer1 = setTimeout(
      () => setDigestState(DigestState.AlmostReady),
      3000,
    );
    const timer2 = setTimeout(() => {
      setDigestState(DigestState.Ready);
      // setDigestTopic("AI Advancements in 2025")
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getButtonColor = useCallback(() => {
    switch (digestState) {
      case DigestState.Preparing:
        return "bg-red-500";
      case DigestState.AlmostReady:
        return "bg-yellow-500";
      case DigestState.Ready:
        return "bg-green-500";
    }
  }, [digestState]);

  const handlePlayClick = useCallback(() => {
    if (digestState === DigestState.Ready) {
      setShowAudioPlayback(true);
    }
  }, [digestState]);

  const handleCustomize = useCallback(() => {
    // Implement customization logic here
    console.log("Customize clicked");
  }, []);

  const handleFlowCommand = async (command: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log("Sending flow command:", command);
      const response = await apiClient.sendFlowCommand(command);

      if (!response.success) {
        throw new Error("Failed to send flow command");
      }

      console.log("Flow command sent successfully");
    } catch (err) {
      console.error("Flow command error:", err);
      setError("Failed to process command. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 relative">
      <div className="relative">
        <Button
          variant="outline"
          className={`w-24 h-24 rounded-full border-2 hover:bg-gray-50 shadow-md overflow-hidden relative ${
            digestState === DigestState.Ready
              ? "cursor-pointer"
              : "cursor-not-allowed"
          }`}
          onClick={handlePlayClick}
          disabled={digestState !== DigestState.Ready}
        >
          <div
            className={`absolute inset-2 ${getButtonColor()} rounded-full opacity-50`}
          ></div>
          <Play className="w-8 h-8 z-10 relative" />
        </Button>
      </div>
      <Button
        variant="outline"
        className="w-16 h-16 rounded-full border-2 hover:bg-gray-50 shadow-md"
      >
        <Mic className="w-6 h-6" />
      </Button>
      {showAudioPlayback && (
        <AudioPlayback onClose={() => setShowAudioPlayback(false)} />
      )}
      <div className="flex space-x-4">
        <button
          onClick={() => handleFlowCommand("next")}
          disabled={isProcessing}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
          Next Topic
        </button>
        <button
          onClick={() => handleFlowCommand("previous")}
          disabled={isProcessing}
          className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 disabled:opacity-50"
        >
          Previous Topic
        </button>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
