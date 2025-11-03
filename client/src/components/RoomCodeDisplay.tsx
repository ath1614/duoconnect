import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface RoomCodeDisplayProps {
  roomCode: string;
}

export default function RoomCodeDisplay({ roomCode }: RoomCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed top-4 left-4 backdrop-blur-md bg-black/40 rounded-lg px-4 py-3 flex items-center gap-3"
      data-testid="display-room-code"
    >
      <div className="text-white">
        <p className="text-xs text-white/70 mb-1">Room Code</p>
        <p className="text-lg font-semibold font-mono">{roomCode}</p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-white hover:bg-white/20"
        onClick={handleCopy}
        data-testid="button-copy-code"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
