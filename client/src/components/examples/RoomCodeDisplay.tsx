import RoomCodeDisplay from "../RoomCodeDisplay";

export default function RoomCodeDisplayExample() {
  return (
    <div className="relative p-8 bg-background min-h-screen">
      <RoomCodeDisplay roomCode="ABC-123-XYZ" />
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Room code is in the top-left corner</p>
      </div>
    </div>
  );
}
