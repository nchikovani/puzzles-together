import {IActionRoom} from "./SocketService.types";

class ActiveRoomsService {
  private _activeRooms: IActionRoom[] = [];

  get activeRooms() {
    return this._activeRooms;
  }

  findRoom(roomId: string) {
    return this._activeRooms.find(activeRoom => activeRoom._id == roomId);
  }

  addRoom(room: IActionRoom) {
    this._activeRooms.push(room);
  }

  removeRoom(roomId: string) {
    this._activeRooms = this._activeRooms.filter(room => room._id != roomId);
  }
}

export default ActiveRoomsService;