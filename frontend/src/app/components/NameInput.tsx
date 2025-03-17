"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";

interface NameInputProps {
  onComplete: (name: string) => void;
}

export default function NameInput({ onComplete }: NameInputProps) {
  const [name, setName] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice recognition process
    setTimeout(() => {
      setIsListening(false);
      setName("John Doe"); // Simulated voice input
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-gray-100 border-gray-300"
      />
      <div className="flex justify-between items-center">
        <Button
          type="button"
          onClick={handleVoiceInput}
          className={`rounded-full w-12 h-12 ${isListening ? "bg-gray-900" : "bg-gray-700"} text-white hover:bg-gray-800`}
        >
          <Mic className={`h-6 w-6 ${isListening ? "animate-pulse" : ""}`} />
        </Button>
        <Button
          type="submit"
          disabled={!name.trim()}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          Next
        </Button>
      </div>
      {isListening && <p className="text-sm text-gray-600">Listening...</p>}
    </form>
  );
}
