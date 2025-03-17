import { Play, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AudioPlayer() {
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-lg p-4">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        <Button variant="ghost" size="icon" className="text-white">
          <SkipBack className="h-6 w-6" />
        </Button>
        <div className="flex-grow mx-4">
          <div className="h-1 bg-gray-600 rounded-full">
            <div className="h-1 bg-pink-500 rounded-full w-1/3"></div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white">
          <Play className="h-8 w-8" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <SkipForward className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
