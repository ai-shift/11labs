"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import VoiceInputScreen from "./VoiceInputScreen"
import ProcessingPage from "./ProcessingPage"

interface OnboardingProps {
  onComplete: (userData: UserData) => void
}

interface UserData {
  name: string
  interests: string[]
  topicsToFollow: string[]
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [userData, setUserData] = useState<UserData>({
    name: "",
    interests: [],
    topicsToFollow: [],
  })

  const handleVoiceInputComplete = (data: UserData) => {
    setUserData(data)
    setStep(2)
  }

  const handleProcessingComplete = () => {
    onComplete(userData)
  }

  const steps = [
    {
      title: "Welcome to Loopcast",
      content:
        "Loopcast is your interactive knowledge engine. It uses voice technology to understand you and provide personalized audio content. Let's get started!",
    },
    {
      title: "Tell Us About Yourself",
      content: <VoiceInputScreen onComplete={handleVoiceInputComplete} />,
    },
    {
      title: "Processing Your Information",
      content: <ProcessingPage onComplete={handleProcessingComplete} userData={userData} />,
    },
  ]

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{steps[step].title}</h2>
        <div className="space-y-4">
          {typeof steps[step].content === "string" ? (
            <p className="text-gray-700">{steps[step].content}</p>
          ) : (
            steps[step].content
          )}
        </div>
        {step === 0 && (
          <Button onClick={() => setStep(1)} className="w-full bg-gray-900 text-white hover:bg-gray-800">
            Get Started
          </Button>
        )}
      </div>
    </div>
  )
}

