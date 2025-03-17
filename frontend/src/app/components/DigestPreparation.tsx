import { Button } from "@/components/ui/button";

interface DigestPreparationProps {
  onStart: () => void;
}

export default function DigestPreparation({ onStart }: DigestPreparationProps) {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-xl font-semibold">Your digest is ready!</h2>
      <p>We've prepared an audio digest based on your interests.</p>
      <Button onClick={onStart}>Start Listening</Button>
    </div>
  );
}
