import VideoPlayer from "../VideoPlayer";

export default function VideoPlayerExample() {
  return (
    <div className="p-8 space-y-4 bg-background min-h-screen">
      <div className="aspect-video w-full max-w-2xl">
        <VideoPlayer
          stream={null}
          username="John Doe"
          isLocal={false}
        />
      </div>
      <div className="aspect-video w-64">
        <VideoPlayer
          stream={null}
          username="You"
          isLocal={true}
          isMuted={true}
        />
      </div>
    </div>
  );
}
