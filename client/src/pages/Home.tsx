import { useState } from "react";
import RoomLobby from "@/components/RoomLobby";
import VideoCall from "@/components/VideoCall";

export default function Home() {
  const [inCall, setInCall] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = () => {
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    setInCall(true);
    console.log("Created room:", newRoomCode);
  };

  const handleJoinRoom = (code: string) => {
    setRoomCode(code);
    setInCall(true);
    console.log("Joined room:", code);
  };

  const handleEndCall = () => {
    setInCall(false);
    setRoomCode("");
    console.log("Call ended");
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

  if (inCall) {
    return (
      <VideoCall
        roomCode={roomCode}
        localStream={null}
        remoteStream={null}
        onEndCall={handleEndCall}
      />
    );
  }

  return <RoomLobby onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
}
