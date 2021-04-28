import {ServerError} from "shared";

export const getUser = async () => {
  const response = await fetch('/users/authenticate', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'same-origin',
  });
  if (!response.ok) {
    const {message} = await response.json();
    throw new ServerError(response.status, message);
  }

  return await response.json();
}

export const getRooms = async (userId: string) => {
  const response = await fetch(`/rooms/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'same-origin',
  });
  if (!response.ok) {
    const {message} = await response.json();
   throw new ServerError(response.status, message);
  }

  return await response.json();
}

export const addRoom = async () => {
  const response = await fetch('/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'same-origin',
  });
  if (!response.ok) {
    const {message} = await response.json();
    throw new ServerError(response.status, message);
  }

  return await response.json();
}

export const deleteRoom = async (roomId: string) => {
  const response = await fetch(`/rooms/${roomId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'same-origin',
  });
  if (!response.ok) {
    const {message} = await response.json();
    throw new ServerError(response.status, message);
  }

  return response;
}

export const getChat = async (chatId: string) => {
  const response = await fetch(`/chat/${chatId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'same-origin',
  });
  if (!response.ok) {
    const {message} = await response.json();
    throw new ServerError(response.status, message);
  }

  return await response.json();
}

// const getHeaders = (token?: string | null) => {
//   const headers: any = {
//     'Content-Type': 'application/json',
//   }
//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }
//   return headers;
// }