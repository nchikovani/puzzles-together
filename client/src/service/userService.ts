
export const getUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/user', {
    method: 'GET',
    headers: getHeaders(token),
    mode: 'same-origin',
  });

  const userData = await response.json();
  return userData;
}

export const getPersonalArea = async (userId: string) => {
  const token = localStorage.getItem('token');

  const response = await fetch('/getPersonalArea', {
    method: 'POST',
    headers: getHeaders(token),
    mode: 'same-origin',
    body: JSON.stringify({userId})
  });

  return await response.json();
}

export const addRoom = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/addRoom', {
    method: 'POST',
    headers: getHeaders(token),
    mode: 'same-origin',
  });

  return await response.json();
}

const getHeaders = (token?: string | null) => {
  const headers: any = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}