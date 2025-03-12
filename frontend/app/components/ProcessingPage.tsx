"use client"

import { useState, useEffect } from "react"

interface ProcessingPageProps {
  onComplete: () => void
  userData: {
    name: string
    interests: string[]
    topicsToFollow: string[]
  }
}

export default function ProcessingPage({ onComplete, userData }: ProcessingPageProps) {
  const [progress, setProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return prevProgress + 1
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setShowSuccess(true)
      // Wait for 5 seconds before calling onComplete
      setTimeout(onComplete, 5000)
    }
  }, [progress, onComplete])

  return (
    <div className="space-y-6">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gray-900 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {!showSuccess && <p className="text-gray-700">Processing your information...</p>}
      {showSuccess && (
        <div className="space-y-4 animate-fade-in">
          <p className="font-semibold text-gray-900 text-lg">Success! Your profile has been created.</p>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">Name:</span> {userData.name}
            </p>
            <p className="font-medium">Interests:</p>
            <ul className="list-disc list-inside text-gray-600">
              {userData.interests.map((interest, index) => (
                <li key={index} className="mb-1">
                  {interest}
                </li>
              ))}
            </ul>
            <p className="font-medium">Topics to Follow:</p>
            <ul className="list-disc list-inside text-gray-600">
              {userData.topicsToFollow.map((topic, index) => (
                <li key={index} className="mb-1">
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-gray-500 mt-4">Redirecting to main screen in a few seconds...</p>
        </div>
      )}
    </div>
  )
}

