"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Interest {
  id: string
  name: string
  enabled: boolean
}

interface FullScreenEditProps {
  interest: Interest
  onUpdate: (updatedInterest: Interest) => void
  onClose: () => void
}

export default function FullScreenEdit({ interest, onUpdate, onClose }: FullScreenEditProps) {
  const [name, setName] = useState(interest.name)
  const [enabled, setEnabled] = useState(interest.enabled)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({ ...interest, name, enabled })
  }

  return (
    <div className="fixed inset-0 bg-white z-50 p-4 flex flex-col">
      <Button variant="ghost" onClick={onClose} className="self-end mb-4">
        Close
      </Button>
      <h2 className="text-2xl font-bold mb-4">Edit Interest</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Interest Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
          <Label htmlFor="enabled">Enable deeper exploration</Label>
        </div>
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  )
}

