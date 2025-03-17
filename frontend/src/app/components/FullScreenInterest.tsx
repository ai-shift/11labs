"use client";

import { useState } from "react";
import { Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FullScreenInterestProps {
  interest: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

export default function FullScreenInterest({
  interest,
  onClose,
}: FullScreenInterestProps) {
  const [isListening, setIsListening] = useState(false);

  const handleSpeakToInteract = () => {
    setIsListening(true);
    // Simulate voice interaction
    setTimeout(() => {
      setIsListening(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-gray-600"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="text-center space-y-8">
        <h2 className="text-4xl font-bold text-gray-800">{interest.name}</h2>

        <Button
          size="lg"
          className={`rounded-full px-8 py-6 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200 ${isListening ? "animate-pulse" : ""}`}
          onClick={handleSpeakToInteract}
          disabled={isListening}
        >
          <Mic
            className={`mr-2 h-6 w-6 ${isListening ? "animate-bounce" : ""}`}
          />
          {isListening ? "Listening..." : "Speak to Interact"}
        </Button>

        {isListening && (
          <p className="text-gray-600 text-lg animate-fade-in">
            Say something about {interest.name}...
          </p>
        )}
      </div>
    </div>
  );
}
