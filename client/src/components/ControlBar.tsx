import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff } from "lucide-react";

interface ControlBarProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
}

export default function ControlBar({
  isMuted,
  isVideoOff,
  isScreenSharing,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
}: ControlBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 backdrop-blur-md bg-black/40 border-t border-white/10">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant={isMuted ? "destructive" : "secondary"}
            className="h-12 w-12 rounded-full"
            onClick={onToggleMute}
            data-testid="button-toggle-mute"
          >
            {isMuted ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>

          <Button
            size="icon"
            variant={isVideoOff ? "destructive" : "secondary"}
            className="h-12 w-12 rounded-full"
            onClick={onToggleVideo}
            data-testid="button-toggle-video"
          >
            {isVideoOff ? (
              <VideoOff className="h-5 w-5" />
            ) : (
              <Video className="h-5 w-5" />
            )}
          </Button>

          <Button
            size="icon"
            variant={isScreenSharing ? "default" : "secondary"}
            className="h-12 w-12 rounded-full"
            onClick={onToggleScreenShare}
            data-testid="button-toggle-screen-share"
          >
            <MonitorUp className="h-5 w-5" />
          </Button>
        </div>

        <Button
          size="icon"
          variant="destructive"
          className="h-12 w-12 rounded-full"
          onClick={onEndCall}
          data-testid="button-end-call"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
