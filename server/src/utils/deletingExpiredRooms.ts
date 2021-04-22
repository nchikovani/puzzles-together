import RoomsService from "../rooms/rooms.service";
import config from "../config";

export const deletingExpiredRooms = async () => {
  try {
    const rooms = await RoomsService.getRooms();
    for (const room of rooms) {
      const now = new Date();
      if ((now.getTime() - room.lastVisit.getTime()) >= config.roomLifeWithoutVisits) {
        await RoomsService.deleteRoom(room._id);
      }
    }
  } catch (error) {
    console.log(error);
  }
}