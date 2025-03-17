"use client";

import { useState } from "react";
import { User } from "lucide-react";
import FullScreenInterest from "./FullScreenInterest";
import ProfileSettings from "./ProfileSettings";
import { Button } from "@/components/ui/button";

interface Interest {
  id: string;
  name: string;
  position: "left" | "right";
  isDotted?: boolean;
}

interface InterestGraphProps {
  interests: string[];
}

export default function InterestGraph({ interests }: InterestGraphProps) {
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(
    null,
  );
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const formattedInterests: Interest[] = interests.map((interest, index) => ({
    id: index.toString(),
    name: interest,
    position: index % 2 === 0 ? "left" : "right",
    isDotted: index % 3 === 0,
  }));

  return (
    <div className="relative h-full bg-white rounded-lg shadow-inner overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Left side interests */}
        <div className="absolute left-4 flex flex-col gap-6">
          {formattedInterests
            .filter((i) => i.position === "left")
            .map((interest) => (
              <div key={interest.id} className="flex items-center gap-2">
                <button
                  className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setSelectedInterest(interest)}
                >
                  {interest.name}
                </button>
                <div
                  className="flex-1 h-[1px] w-24"
                  style={{
                    background: interest.isDotted
                      ? "repeating-linear-gradient(to right, #CBD5E1 0, #CBD5E1 4px, transparent 4px, transparent 8px)"
                      : "#CBD5E1",
                  }}
                />
              </div>
            ))}
        </div>

        {/* Center user icon */}
        <Button
          className="z-10 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200"
          onClick={() => setShowProfileSettings(true)}
        >
          <User className="w-6 h-6 text-gray-600" />
        </Button>

        {/* Right side interests */}
        <div className="absolute right-4 flex flex-col gap-6">
          {formattedInterests
            .filter((i) => i.position === "right")
            .map((interest) => (
              <div key={interest.id} className="flex items-center gap-2">
                <div className="h-[1px] w-24 bg-gray-300" />
                <button
                  className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setSelectedInterest(interest)}
                >
                  {interest.name}
                </button>
              </div>
            ))}
        </div>
      </div>

      {selectedInterest && (
        <FullScreenInterest
          interest={selectedInterest}
          onClose={() => setSelectedInterest(null)}
        />
      )}
      {showProfileSettings && (
        <ProfileSettings
          interests={formattedInterests}
          onClose={() => setShowProfileSettings(false)}
        />
      )}
    </div>
  );
}
