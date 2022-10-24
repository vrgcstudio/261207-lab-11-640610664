import { checkToken } from "../../backendLibs/checkToken";
import { readChatRoomsDB } from "../../backendLibs/dbLib";

export default function roomRoute(req, res) {
  const user = checkToken(req);
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "Yon don't permission to access this api",
    });
  }
  const chatrooms = readChatRoomsDB();

  //create room data and return response
  const rooms = [];
  for (const chatroom of chatrooms) {
    rooms.push({
      roomId: chatroom.roomId,
      roomName: chatroom.roomName,
    });
  }

  return res.json({
    ok: true,
    rooms,
  });
}
