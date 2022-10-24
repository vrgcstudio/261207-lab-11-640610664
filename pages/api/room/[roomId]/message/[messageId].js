import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //get ids from url
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;

  //check token
  const user = checkToken(req);
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "Yon don't permission to access this api",
    });
  }

  const rooms = readChatRoomsDB();

  //check if roomId exist
  const rommIDX = rooms.findIndex((x) => x.roomId === roomId);
  if (rommIDX === -1) {
    return res.status(404).json({ ok: false, message: "Invalid room ID" });
  }

  //check if messageId exist
  const message = rooms[rommIDX].messages;
  const messageIDX = message.findIndex((x) => x.messageId === messageId);
  if (messageIDX === -1) {
    return res.status(404).json({ ok: false, message: "Invalid message ID" });
  }

  //check if token owner is admin, they can delete any message
  //or if token owner is normal user, they can only delete their own message!
  if (req.method === "DELETE") {
    const user = checkToken(req);
    if (!user.isAdmin && user.username !== message[messageIDX].username) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to access this data",
      });
    }
    rooms[rommIDX].messages.splice(messageIDX, 1);
    writeChatRoomsDB(rooms);
    return res.json({ ok: true });
  }
}
