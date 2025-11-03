import ConnectionStatus from "../ConnectionStatus";

export default function ConnectionStatusExample() {
  return (
    <div className="p-8 space-y-4 bg-background min-h-screen">
      <div className="space-y-4">
        <div className="relative h-24 bg-muted rounded-lg">
          <ConnectionStatus quality="excellent" />
        </div>
        <div className="relative h-24 bg-muted rounded-lg">
          <ConnectionStatus quality="good" />
        </div>
        <div className="relative h-24 bg-muted rounded-lg">
          <ConnectionStatus quality="poor" />
        </div>
        <div className="relative h-24 bg-muted rounded-lg">
          <ConnectionStatus quality="disconnected" />
        </div>
      </div>
    </div>
  );
}
