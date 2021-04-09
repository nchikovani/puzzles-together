import {ActiveRoomTypes} from "./SocketService.types";

class ActiveRoomsService {
  activeRooms: ActiveRoomTypes[] = [];

  findRoom(roomId: string) {
    return this.activeRooms.find(activeRoom => activeRoom._id == roomId);
  }

  addRoom(room: ActiveRoomTypes) {
    this.activeRooms.push(room);
  }

  removeRoom(roomId: string) {
    this.activeRooms = this.activeRooms.filter(room => room._id != roomId);
  }
}

export default ActiveRoomsService;