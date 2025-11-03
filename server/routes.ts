import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";

interface Room {
  id: string;
  participants: Set<string>;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize Socket.IO with CORS settings
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Store active rooms
  const rooms = new Map<string, Room>();

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Handle room creation
    socket.on("create-room", (roomCode: string) => {
      console.log("Creating room:", roomCode);
      
      if (!rooms.has(roomCode)) {
        rooms.set(roomCode, {
          id: roomCode,
          participants: new Set()
        });
      }

      const room = rooms.get(roomCode)!;
      room.participants.add(socket.id);
      socket.join(roomCode);

      socket.emit("room-created", { roomCode });
      console.log(`Room ${roomCode} created by ${socket.id}`);
    });

    // Handle joining a room
    socket.on("join-room", (roomCode: string) => {
      console.log("Joining room:", roomCode, "by", socket.id);

      if (!rooms.has(roomCode)) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      const room = rooms.get(roomCode)!;
      
      // Limit to 2 participants for peer-to-peer
      if (room.participants.size >= 2) {
        socket.emit("error", { message: "Room is full" });
        return;
      }

      room.participants.add(socket.id);
      socket.join(roomCode);

      // Notify the other participant
      const otherParticipants = Array.from(room.participants).filter(
        (id) => id !== socket.id
      );

      if (otherParticipants.length > 0) {
        const otherId = otherParticipants[0];
        // Tell the joiner to initiate the connection
        socket.emit("peer-joined", { peerId: otherId });
        // Tell the existing participant about the new joiner
        io.to(otherId).emit("peer-joined", { peerId: socket.id });
      }

      console.log(`${socket.id} joined room ${roomCode}`);
    });

    // Forward WebRTC signaling messages
    socket.on("signal", ({ to, signal }: { to: string; signal: any }) => {
      console.log("Forwarding signal from", socket.id, "to", to);
      io.to(to).emit("signal", {
        from: socket.id,
        signal
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      // Remove from all rooms and notify peers
      rooms.forEach((room, roomCode) => {
        if (room.participants.has(socket.id)) {
          room.participants.delete(socket.id);
          
          // Notify other participants
          room.participants.forEach((participantId) => {
            io.to(participantId).emit("peer-left", { peerId: socket.id });
          });

          // Clean up empty rooms
          if (room.participants.size === 0) {
            rooms.delete(roomCode);
            console.log(`Room ${roomCode} deleted (empty)`);
          }
        }
      });
    });
  });

  return httpServer;
}
