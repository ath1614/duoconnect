import RoomLobby from "../RoomLobby";

export default function RoomLobbyExample() {
  return (
    <RoomLobby
      onCreateRoom={() => console.log("Create room triggered")}
      onJoinRoom={(roomId) => console.log("Join room triggered:", roomId)}
    />
  );
}
