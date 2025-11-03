import { useState } from "react";
import ControlBar from "../ControlBar";

export default function ControlBarExample() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  return (
    <div className="relative h-screen bg-background">
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Control bar is at the bottom</p>
      </div>
      <ControlBar
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        onToggleMute={() => {
          setIsMuted(!isMuted);
          console.log("Toggle mute:", !isMuted);
        }}
        onToggleVideo={() => {
          setIsVideoOff(!isVideoOff);
          console.log("Toggle video:", !isVideoOff);
        }}
        onToggleScreenShare={() => {
          setIsScreenSharing(!isScreenSharing);
          console.log("Toggle screen share:", !isScreenSharing);
        }}
        onEndCall={() => console.log("End call triggered")}
      />
    </div>
  );
}
