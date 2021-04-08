import RoomsService from "../rooms/rooms.service";
import config from "../config";
import fs = require("fs");

export const deletingExpiredRooms = async () => {
  try {
    const rooms = await RoomsService.getRooms();
    for (const room of rooms) {
      const now = new Date();
      if ((now.getTime() - room.lastVisit.getTime()) >= config.roomLifeWithoutVisits) {
        await RoomsService.deleteRoom(room._id);
        if (fs.existsSync(`${config.roomJsonPuzzlePath}${room._id}.json`)) {
          fs.unlinkSync(`${config.roomJsonPuzzlePath}${room._id}.json`);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}