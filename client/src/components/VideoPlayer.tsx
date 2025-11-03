import { useEffect, useRef } from "react";
import { User, StarOff } from "lucide-react";

interface VideoPlayerProps {
  stream: MediaStream | null;
  isMuted?: boolean;
  isLocal?: boolean;
  username?: string;
  className?: string;
}

export default function VideoPlayer({
  stream,
  isMuted = false,
  isLocal = false,
  username,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const hasVideo = stream?.getVideoTracks().some((track) => track.enabled);

  return (
    <div
      className={`relative rounded-lg overflow-hidden bg-black ${className}`}
      data-testid={isLocal ? "video-local" : "video-remote"}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center">
            <StarOff className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Camera Off</p>
          </div>
        </div>
      )}

      {username && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium drop-shadow-md">
              {username}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
