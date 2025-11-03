import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";

interface RoomLobbyProps {
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
}

export default function RoomLobby({ onCreateRoom, onJoinRoom }: RoomLobbyProps) {
  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      onJoinRoom(roomId.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-primary rounded-full p-3">
              <Video className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Video Conference</CardTitle>
          <CardDescription>
            Create a new room or join an existing one to start your call
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button
              className="w-full h-12"
              size="lg"
              onClick={onCreateRoom}
              data-testid="button-create-room"
            >
              Create New Room
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-id">Room Code</Label>
              <Input
                id="room-id"
                placeholder="Enter room code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="h-12"
                data-testid="input-room-code"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              className="w-full h-12"
              size="lg"
              disabled={!roomId.trim()}
              data-testid="button-join-room"
            >
              Join Room
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
