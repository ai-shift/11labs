import { Home, Book, GitGraphIcon as Graph, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-lg">
      <div className="flex justify-around py-2">
        <Button variant="ghost" size="icon" className="text-white">
          <Home className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <Book className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <Graph className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <Settings className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  )
}

