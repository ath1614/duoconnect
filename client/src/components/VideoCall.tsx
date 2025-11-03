import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import ControlBar from "./ControlBar";
import ConnectionStatus from "./ConnectionStatus";
import RoomCodeDisplay from "./RoomCodeDisplay";

interface VideoCallProps {
  roomCode: string;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEndCall: () => void;
}

export default function VideoCall({
  roomCode,
  localStream,
  remoteStream,
  onEndCall,
}: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleToggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleToggleScreenShare = async () => {
    console.log("Screen share toggle:", !isScreenSharing);
    setIsScreenSharing(!isScreenSharing);
  };

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      <RoomCodeDisplay roomCode={roomCode} />
      <ConnectionStatus quality="good" />

      {remoteStream ? (
        <div className="w-full h-full">
          <VideoPlayer
            stream={remoteStream}
            username="Remote User"
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            </div>
            <p className="text-white text-lg font-medium mb-2">Waiting for connection...</p>
            <p className="text-white/60 text-sm">Share the room code with your friend to start</p>
          </div>
        </div>
      )}

      {localStream && (
        <div className="absolute bottom-24 right-6 w-64 aspect-video shadow-lg border-2 border-white/20 rounded-lg overflow-hidden">
          <VideoPlayer
            stream={localStream}
            isMuted={true}
            isLocal={true}
            username="You"
            className="w-full h-full"
          />
        </div>
      )}

      <ControlBar
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onToggleScreenShare={handleToggleScreenShare}
        onEndCall={onEndCall}
      />
    </div>
  );
}
