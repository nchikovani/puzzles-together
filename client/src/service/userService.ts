
export const getUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/user', {
    method: 'GET',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    }),
    mode: 'same-origin',
  });

  const userData = await response.json();
  return userData;
}

// export const postUser = async () => {
//   const response = await fetch('/user', {
//     method: 'POST',
//     headers: new Headers({
//       Accept: 'application/json',
//       'Content-Type': 'application/json'
//     }),
//     mode: 'same-origin',
//   });
//
//   const {token} = await response.json();
//   return token;
// }

export const getRooms = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/rooms', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    mode: 'same-origin',
  });

  return await response.json();
}

export const postRoom = async (name: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/room', {
    method: 'POST',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    }),
    mode: 'same-origin',
    body: JSON.stringify({name})
  });

  return await response.json();
}