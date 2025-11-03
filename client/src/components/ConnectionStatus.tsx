import { Signal, SignalHigh, SignalLow, SignalZero } from "lucide-react";

type ConnectionQuality = "excellent" | "good" | "poor" | "disconnected";

interface ConnectionStatusProps {
  quality: ConnectionQuality;
}

export default function ConnectionStatus({ quality }: ConnectionStatusProps) {
  const getIcon = () => {
    switch (quality) {
      case "excellent":
        return <Signal className="h-4 w-4" />;
      case "good":
        return <SignalHigh className="h-4 w-4" />;
      case "poor":
        return <SignalLow className="h-4 w-4" />;
      case "disconnected":
        return <SignalZero className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (quality) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Good";
      case "poor":
        return "Poor";
      case "disconnected":
        return "Disconnected";
    }
  };

  const getColor = () => {
    switch (quality) {
      case "excellent":
        return "text-green-500";
      case "good":
        return "text-blue-500";
      case "poor":
        return "text-yellow-500";
      case "disconnected":
        return "text-red-500";
    }
  };

  return (
    <div
      className="fixed top-4 right-4 backdrop-blur-md bg-black/40 rounded-full px-4 py-2 flex items-center gap-2"
      data-testid="status-connection"
    >
      <div className={getColor()}>{getIcon()}</div>
      <span className="text-sm font-medium text-white">{getLabel()}</span>
    </div>
  );
}
