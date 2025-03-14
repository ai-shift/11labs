"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface CustomizationProps {
  onClose: () => void
}

export default function Customization({ onClose }: CustomizationProps) {
  const [settings, setSettings] = useState({
    dailyDigest: true,
    voiceInteraction: true,
    dataUsage: false,
  })

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const handleSave = () => {
    // Here you would typically save the settings to your backend or local storage
    console.log("Saving settings:", settings)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[90%] max-w-md">
        <CardHeader>
          <CardTitle>Customize Loopcast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="daily-digest">Daily Digest</Label>
            <Switch
              id="daily-digest"
              checked={settings.dailyDigest}
              onCheckedChange={() => handleSettingChange("dailyDigest")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-interaction">Voice Interaction</Label>
            <Switch
              id="voice-interaction"
              checked={settings.voiceInteraction}
              onCheckedChange={() => handleSettingChange("voiceInteraction")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="data-usage">Allow Data Usage</Label>
            <Switch
              id="data-usage"
              checked={settings.dataUsage}
              onCheckedChange={() => handleSettingChange("dataUsage")}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

