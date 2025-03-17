import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DigestView() {
  return (
    <ScrollArea className="h-full px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Your Daily Digest</h2>
      <div className="space-y-4">
        <Card className="bg-white bg-opacity-10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle>AI Advancements</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Latest breakthroughs in machine learning and neural networks...
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white bg-opacity-10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle>Renewable Energy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>New solar technology increases efficiency by 40%...</p>
          </CardContent>
        </Card>
        <Card className="bg-white bg-opacity-10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle>Global Economics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Emerging markets show resilience amid global challenges...</p>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
