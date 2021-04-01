
class UserService {
  async postUser() {
    const response = await fetch('/user', {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }),
      mode: 'same-origin',
    });

    const {token} = await response.json();
    return token;
  }

  async getRooms() {
    const token = localStorage.getItem('token');
    const response = await fetch('/rooms', {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      },
      mode: 'same-origin',
    });

    const {rooms, error} = await response.json();
    return rooms;
  }

  async postRoom(name: string) {
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

    const {rooms} = await response.json();
    return rooms;
  }
}

export default UserService;