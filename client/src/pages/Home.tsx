import { useState, useEffect } from "react";
import RoomLobby from "@/components/RoomLobby";
import VideoCall from "@/components/VideoCall";
import { useMediaStream } from "@/hooks/useMediaStream";
import { useWebRTC } from "@/hooks/useWebRTC";

type ConnectionQuality = "excellent" | "good" | "poor" | "disconnected";

export default function Home() {
  const [inCall, setInCall] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>("good");
  const [isCreator, setIsCreator] = useState(false);

  const { localStream, isScreenSharing, error, startCamera, toggleScreenShare } =
    useMediaStream();

  const { createRoom, joinRoom } = useWebRTC({
    roomCode,
    localStream,
    onRemoteStream: setRemoteStream,
    onConnectionQuality: setConnectionQuality,
  });

  const handleCreateRoom = async () => {
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    setIsCreator(true);
    setInCall(true);

    try {
      await startCamera();
      // Give a moment for the stream to initialize
      setTimeout(() => {
        createRoom();
      }, 500);
    } catch (err) {
      console.error("Failed to start camera:", err);
      alert("Unable to access camera. Please check your permissions.");
      setInCall(false);
    }
  };

  const handleJoinRoom = async (code: string) => {
    setRoomCode(code);
    setIsCreator(false);
    setInCall(true);

    try {
      await startCamera();
      // Give a moment for the stream to initialize
      setTimeout(() => {
        joinRoom();
      }, 500);
    } catch (err) {
      console.error("Failed to start camera:", err);
      alert("Unable to access camera. Please check your permissions.");
      setInCall(false);
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setInCall(false);
    setRoomCode("");
    setRemoteStream(null);
    window.location.reload();
  };

  const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 3; i++) {
      if (i > 0) code += "-";
      for (let j = 0; j < 3; j++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return code;
  };

  // Show error if media access fails
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  if (inCall) {
    return (
      <VideoCall
        roomCode={roomCode}
        localStream={localStream}
        remoteStream={remoteStream}
        connectionQuality={connectionQuality}
        isScreenSharing={isScreenSharing}
        onToggleScreenShare={toggleScreenShare}
        onEndCall={handleEndCall}
      />
    );
  }

  return <RoomLobby onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
}
