import { useState, useEffect, useCallback } from "react";

export function useMediaStream() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize camera and microphone
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 24, max: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      setLocalStream(stream);
      setError(null);
      return stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError("Unable to access camera or microphone. Please check permissions.");
      throw err;
    }
  }, []);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Switch back to camera
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      await startCamera();
      setIsScreenSharing(false);
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            frameRate: { ideal: 24, max: 30 },
          } as MediaTrackConstraints,
          audio: false,
        });

        // Keep the audio track from the original stream
        if (localStream) {
          const audioTrack = localStream.getAudioTracks()[0];
          if (audioTrack) {
            screenStream.addTrack(audioTrack);
          }
          // Stop the old video tracks
          localStream.getVideoTracks().forEach((track) => track.stop());
        }

        // Handle when user stops sharing via browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          startCamera();
        };

        setLocalStream(screenStream);
        setIsScreenSharing(true);
      } catch (err) {
        console.error("Error starting screen share:", err);
        setError("Unable to start screen sharing.");
      }
    }
  }, [isScreenSharing, localStream, startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream]);

  return {
    localStream,
    isScreenSharing,
    error,
    startCamera,
    toggleScreenShare,
  };
}
