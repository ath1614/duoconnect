import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import SimplePeer from "simple-peer";

interface UseWebRTCProps {
  roomCode: string;
  localStream: MediaStream | null;
  isCreator: boolean;
  onRemoteStream: (stream: MediaStream | null) => void;
  onConnectionQuality: (quality: "excellent" | "good" | "poor" | "disconnected") => void;
}

export function useWebRTC({
  roomCode,
  localStream,
  isCreator,
  onRemoteStream,
  onConnectionQuality,
}: UseWebRTCProps) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);

  useEffect(() => {
    if (!roomCode) return;

    // Connect to signaling server
    const socket = io(window.location.origin, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to signaling server");
      onConnectionQuality("good");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from signaling server");
      onConnectionQuality("disconnected");
      setIsConnected(false);
      onRemoteStream(null);
    });

    socket.on("room-created", () => {
      console.log("Room created successfully");
    });

    socket.on("peer-joined", ({ peerId: remotePeerId }: { peerId: string }) => {
      console.log("Peer joined:", remotePeerId);
      setPeerId(remotePeerId);
      
      // Only the joiner initiates the peer connection
      // The creator waits for signals
      if (!peerRef.current && localStream && !isCreator) {
        createPeer(remotePeerId, true, socket, localStream);
      }
    });

    socket.on("signal", ({ from, signal }: { from: string; signal: any }) => {
      console.log("Received signal from:", from);
      
      if (!peerRef.current && localStream) {
        // Create peer connection as receiver
        createPeer(from, false, socket, localStream);
      }
      
      if (peerRef.current) {
        peerRef.current.signal(signal);
      }
    });

    socket.on("peer-left", () => {
      console.log("Peer left");
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      setIsConnected(false);
      onRemoteStream(null);
      onConnectionQuality("good");
    });

    socket.on("error", ({ message }: { message: string }) => {
      console.error("Socket error:", message);
      alert(message);
    });

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      socket.disconnect();
    };
  }, [roomCode]);

  // Update peer stream when local stream changes
  useEffect(() => {
    if (peerRef.current && localStream) {
      // Remove old tracks
      const senders = (peerRef.current as any)._pc?.getSenders() || [];
      senders.forEach((sender: RTCRtpSender) => {
        (peerRef.current as any)._pc?.removeTrack(sender);
      });

      // Add new tracks
      localStream.getTracks().forEach((track) => {
        peerRef.current?.addTrack(track, localStream);
      });
    }
  }, [localStream]);

  const createPeer = (
    remotePeerId: string,
    initiator: boolean,
    socket: Socket,
    stream: MediaStream
  ) => {
    console.log("Creating peer connection, initiator:", initiator);

    const peer = new SimplePeer({
      initiator,
      trickle: true,
      stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.on("signal", (signal: any) => {
      console.log("Sending signal to:", remotePeerId);
      socket.emit("signal", { to: remotePeerId, signal });
    });

    peer.on("stream", (remoteStream: MediaStream) => {
      console.log("Received remote stream");
      onRemoteStream(remoteStream);
      setIsConnected(true);
      onConnectionQuality("excellent");
    });

    peer.on("connect", () => {
      console.log("Peer connection established");
      setIsConnected(true);
      onConnectionQuality("excellent");
      
      // Monitor connection quality
      startQualityMonitoring(peer);
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
      setIsConnected(false);
      onRemoteStream(null);
    });

    peer.on("error", (err: Error) => {
      console.error("Peer connection error:", err);
      onConnectionQuality("poor");
    });

    peerRef.current = peer;
  };

  const startQualityMonitoring = (peer: SimplePeer.Instance) => {
    const checkQuality = () => {
      const pc = (peer as any)._pc as RTCPeerConnection;
      if (!pc) return;

      pc.getStats(null).then((stats) => {
        stats.forEach((report) => {
          if (report.type === "inbound-rtp" && report.kind === "video") {
            const packetsLost = report.packetsLost || 0;
            const packetsReceived = report.packetsReceived || 0;
            const totalPackets = packetsLost + packetsReceived;
            
            if (totalPackets > 0) {
              const lossRate = packetsLost / totalPackets;
              
              if (lossRate < 0.02) {
                onConnectionQuality("excellent");
              } else if (lossRate < 0.05) {
                onConnectionQuality("good");
              } else {
                onConnectionQuality("poor");
              }
            }
          }
        });
      }).catch((err) => {
        console.error("Error getting stats:", err);
      });
    };

    // Check quality every 2 seconds
    const interval = setInterval(checkQuality, 2000);
    
    // Cleanup on peer close
    peer.on("close", () => {
      clearInterval(interval);
    });
  };

  const createRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("create-room", roomCode);
    }
  };

  const joinRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("join-room", roomCode);
    }
  };

  return {
    isConnected,
    createRoom,
    joinRoom,
  };
}
