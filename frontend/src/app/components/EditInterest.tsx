"use client";

import { useState } from "react";
import { Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditInterestProps {
  interest: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

export default function EditInterest({ interest, onClose }: EditInterestProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSpeakToEdit = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="text-center space-y-8">
        <h2 className="text-2xl font-bold">{interest.name}</h2>

        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-pulse text-lg">Processing...</div>
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <Button
            size="lg"
            className="rounded-full px-8"
            onClick={handleSpeakToEdit}
          >
            <Mic className="mr-2 h-5 w-5" />
            Speak to Edit
          </Button>
        )}
      </div>
    </div>
  );
}
