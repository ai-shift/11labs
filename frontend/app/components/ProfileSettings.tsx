"use client"

import { X, Mic, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Interest {
  id: string
  name: string
  position: "left" | "right"
  isDotted?: boolean
}

interface ProfileSettingsProps {
  interests: Interest[]
  onClose: () => void
}

export default function ProfileSettings({ interests, onClose }: ProfileSettingsProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center p-4 animate-fade-in">
      <div className="w-full max-w-lg">
        <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
          <X className="h-6 w-6 text-gray-600" />
        </Button>

        <h2 className="text-2xl font-bold mt-8 mb-16 text-gray-800 text-center">Profile</h2>

        <div className="relative h-[40vh] flex items-center justify-center">
          {/* Left side interests */}
          <div className="absolute left-4 flex flex-col gap-6">
            {interests
              .filter((i) => i.position === "left")
              .map((interest) => (
                <div key={interest.id} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{interest.name}</span>
                  <div
                    className="flex-1 h-[1px] w-32"
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
          <div className="z-10 w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
            <User className="w-8 h-8 text-gray-600" />
          </div>

          {/* Right side interests */}
          <div className="absolute right-4 flex flex-col gap-6">
            {interests
              .filter((i) => i.position === "right")
              .map((interest) => (
                <div key={interest.id} className="flex items-center gap-2">
                  <div className="h-[1px] w-32 bg-gray-300" />
                  <span className="text-sm text-gray-600">{interest.name}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-col items-center mt-16">
          <Button size="lg" className="rounded-full px-8 py-6 bg-gray-200 text-gray-700 hover:bg-gray-300">
            <Mic className="mr-2 h-5 w-5" />
            Speak to Interact
          </Button>
        </div>
      </div>
    </div>
  )
}

