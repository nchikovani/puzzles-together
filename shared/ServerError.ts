
class ServerError extends Error{
  code: number;
  message: string;
  constructor(code: number, message: string) {
    super();
    this.code = code;
    this.message = message;
  }
}

export const serverErrorMessages = {
  serverError: 'Server error',
  roomNotFound: 'Room not found',
  didNotJoin: 'Did not join the room',
  optionsNotCreated: 'OPTIONS_NOT_CREATED',
  puzzleNotCreated: 'Puzzle not created',
  imageNotCorrect: 'Image is not in the correct format',
  gameNotInit: 'Game is not initialized',
  optionNotFound: 'Option not found',
  incorrectSavedData: 'Incorrect saved data',
  userNotFound: 'User not Found',
  accessIsDenied: 'Access to the page is denied',
  invalidToken: 'Invalid token',
  noAccessRights: 'NO_ACCESS_RIGHTS',
  chatNotFound: 'CHAT_NOT_FOUND',
};



export default ServerError;