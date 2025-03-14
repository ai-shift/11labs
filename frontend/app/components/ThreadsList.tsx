"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Thread {
  id: number
  title: string
  lastUpdate: string
  unread: number
  subThreads?: Thread[]
}

export default function ThreadsList() {
  const [expandedThread, setExpandedThread] = useState<number | null>(null)
  const [playingThread, setPlayingThread] = useState<number | null>(null)
  const [visibleThreads, setVisibleThreads] = useState<Thread[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const threads: Thread[] = [
    {
      id: 1,
      title: "AI & Technology",
      lastUpdate: "2 min ago",
      unread: 3,
      subThreads: [
        { id: 11, title: "Machine Learning", lastUpdate: "5 min ago", unread: 1 },
        { id: 12, title: "Neural Networks", lastUpdate: "10 min ago", unread: 2 },
      ],
    },
    {
      id: 2,
      title: "Science Digest",
      lastUpdate: "1 hour ago",
      unread: 1,
      subThreads: [
        { id: 21, title: "Physics", lastUpdate: "2 hours ago", unread: 0 },
        { id: 22, title: "Biology", lastUpdate: "3 hours ago", unread: 1 },
      ],
    },
    {
      id: 3,
      title: "Global Economics",
      lastUpdate: "3 hours ago",
      unread: 2,
      subThreads: [
        { id: 31, title: "Market Trends", lastUpdate: "4 hours ago", unread: 1 },
        { id: 32, title: "Financial Policies", lastUpdate: "5 hours ago", unread: 1 },
      ],
    },
    {
      id: 4,
      title: "Environmental Studies",
      lastUpdate: "5 hours ago",
      unread: 0,
      subThreads: [
        { id: 41, title: "Climate Change", lastUpdate: "6 hours ago", unread: 0 },
        { id: 42, title: "Sustainable Energy", lastUpdate: "7 hours ago", unread: 0 },
      ],
    },
    {
      id: 5,
      title: "Health & Wellness",
      lastUpdate: "8 hours ago",
      unread: 1,
      subThreads: [
        { id: 51, title: "Nutrition", lastUpdate: "9 hours ago", unread: 1 },
        { id: 52, title: "Mental Health", lastUpdate: "10 hours ago", unread: 0 },
      ],
    },
  ]

  useEffect(() => {
    setVisibleThreads(threads.slice(0, 3))
  }, [])

  const toggleThread = (threadId: number) => {
    setExpandedThread((prev) => (prev === threadId ? null : threadId))
  }

  const togglePlayThread = (threadId: number) => {
    setPlayingThread((prev) => (prev === threadId ? null : threadId))
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        const currentLength = visibleThreads.length
        const nextThreads = threads.slice(currentLength, currentLength + 3)
        setVisibleThreads((prev) => [...prev, ...nextThreads])
      }
    }
  }

  const ThreadItem = ({ thread, isMainThread = false }: { thread: Thread; isMainThread?: boolean }) => {
    const isExpanded = expandedThread === thread.id
    const isPlaying = playingThread === thread.id

    return (
      <Card className={`p-3 flex items-center justify-between ${isMainThread ? "bg-white" : "bg-gray-50 ml-4"}`}>
        <div className="flex items-center flex-1">
          {isMainThread && thread.subThreads && (
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8 mr-2" onClick={() => toggleThread(thread.id)}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          <div className="flex-1">
            <h3 className="text-sm font-medium">{thread.title}</h3>
            <p className="text-xs text-gray-500">{thread.lastUpdate}</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-2" onClick={() => togglePlayThread(thread.id)}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
        {thread.unread > 0 && (
          <div className="bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center ml-2">
            {thread.unread}
          </div>
        )}
      </Card>
    )
  }

  return (
    <ScrollArea className="h-full px-4" onScrollCapture={handleScroll} ref={scrollRef}>
      <div className="space-y-1 py-4">
        <h2 className="text-sm font-semibold mb-3">Threads</h2>
        {visibleThreads.map((thread) => (
          <div key={thread.id} className="mb-1">
            <ThreadItem thread={thread} isMainThread={true} />
            {expandedThread === thread.id && thread.subThreads && (
              <div className="mt-1 space-y-1">
                {thread.subThreads.map((subThread) => (
                  <ThreadItem key={subThread.id} thread={subThread} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

