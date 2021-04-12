import {IActionRoom} from "./SocketService.types";

class ActiveRoomsService {
  activeRooms: IActionRoom[] = [];

  findRoom(roomId: string) {
    return this.activeRooms.find(activeRoom => activeRoom._id == roomId);
  }

  addRoom(room: IActionRoom) {
    this.activeRooms.push(room);
  }

  removeRoom(roomId: string) {
    this.activeRooms = this.activeRooms.filter(room => room._id != roomId);
  }
}

export default ActiveRoomsService;