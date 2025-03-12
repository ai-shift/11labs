"use client"

import { useState, useEffect } from "react"
import InterestGraph from "./components/InterestGraph"
import MainActions from "./components/MainActions"
import ThreadsList from "./components/ThreadsList"
import Onboarding from "./components/Onboarding"
import VoiceInput from './components/VoiceInput'
import { Home as HomeIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface UserData {
  name: string
  interests: string[]
  topicsToFollow: string[]
}

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted")
    if (onboardingCompleted) {
      setShowOnboarding(false)
      setUserData(JSON.parse(onboardingCompleted))
    }
  }, [])

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data)
    setShowOnboarding(false)
    localStorage.setItem("onboardingCompleted", JSON.stringify(data))
  }

  if (showOnboarding) {
    return <VoiceInput onComplete={handleOnboardingComplete} />
  }

  return (
    <main className="min-h-screen flex">
      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Welcome back, {userData?.name}!</h1>
            <p className="text-gray-600">Your personalized audio digest is ready.</p>
          </div>
          <MainActions />
        </div>
      </div>
    </main>
  )
}

