import VideoCall from "../VideoCall";

export default function VideoCallExample() {
  return (
    <VideoCall
      roomCode="ABC-123-XYZ"
      localStream={null}
      remoteStream={null}
      onEndCall={() => console.log("End call triggered")}
    />
  );
}
