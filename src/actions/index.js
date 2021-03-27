export function setGameData(gameData) {
    return {
        type: 'SET_GAME_DATA',
        gameData,
    }
}

export function setUpdate(update) {
    return {
        type: 'SET_UPDATE',
        update,
    }
}

export function setRoomId(roomId) {
    return {
        type: 'SET_ROOM_ID',
        roomId,
    }
}

export function setNotFound(isNotFound) {
    return {
        type: 'SET_NOT_FOUND',
        isNotFound,
    }
}