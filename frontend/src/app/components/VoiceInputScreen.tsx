"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface VoiceInputScreenProps {
  onComplete: (userData: {
    name: string;
    interests: string[];
    topicsToFollow: string[];
  }) => void;
}

export default function VoiceInputScreen({
  onComplete,
}: VoiceInputScreenProps) {
  const [isListening, setIsListening] = useState(false);
  const [instruction, setInstruction] = useState(
    "Tell us your name, interests, and topics you'd like to follow.",
  );

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice recognition process
    setTimeout(() => {
      setIsListening(false);
      // Simulated voice input result
      const simulatedData = {
        name: "John Doe",
        interests: [
          "Artificial Intelligence",
          "Quantum Computing",
          "Space Exploration",
        ],
        topicsToFollow: [
          "Technology News",
          "Scientific Discoveries",
          "Future Trends",
        ],
      };
      onComplete(simulatedData);
    }, 3000);
  };

  return (
    <div className="text-center space-y-6">
      <p className="text-gray-700">{instruction}</p>
      <div className="relative inline-block">
        <Button
          size="lg"
          className={`rounded-full w-24 h-24 ${isListening ? "bg-gray-900" : "bg-gray-700"} text-white hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105`}
          onClick={handleVoiceInput}
          disabled={isListening}
        >
          <Mic className={`h-8 w-8 ${isListening ? "animate-pulse" : ""}`} />
        </Button>
        {isListening && (
          <div className="absolute -inset-2 rounded-full border-4 border-gray-400 animate-ping"></div>
        )}
      </div>
      {isListening && (
        <p className="text-sm text-gray-600">
          We're listening... Tell us about yourself.
        </p>
      )}
    </div>
  );
}
