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
    // Check if the user has completed onboarding before
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

  const handleRestartOnboarding = () => {
    // Clear session data
    localStorage.removeItem("onboardingCompleted")
    setShowOnboarding(true)
    setUserData(null)
  }

  if (showOnboarding) {
    return <VoiceInput onComplete={handleOnboardingComplete} />
  }

  return (
    <main className="min-h-screen flex">
      {/* Left Sidebar - Threads */}
      <div className="w-80 border-r border-gray-200 h-screen">
        <div className="p-4 flex items-center justify-between">
          <h2 className="font-semibold">Threads</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRestartOnboarding}
            title="Restart Onboarding"
          >
            <HomeIcon className="h-5 w-5" />
          </Button>
        </div>
        <ThreadsList />
      </div>

      {/* Main Content - Radio Controls */}
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

