const API_URL = '/api/accounts'

function getCookie(cname) {
  let name = `${cname}=`;
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export class AuthorizationError extends Error {
  constructor(message, {details} = {}) {
  	super(message);
    this.name = 'AUTHORIZATION_ERROR'
    this.details = details
  };
}

export const login = async({username, password, labName, method = 'POST'} = {}) => {
  let requestOptions = {}
  if (method == 'POST') {
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({email:username, password: password})
    };
  }
  const response = await fetch(`${API_URL}/login/${labName}/`, requestOptions)
  if (response.status == 403) {
    throw new AuthorizationError('Forbidden 403.')
  }
  const data = await response.json()
  if (response.status == 400) {
    throw new AuthorizationError('Bad Request.', {details:data})
  }
  return data;
}

export const logout = async() => {
  const response = await fetch(`${API_URL}/logout/`)
  if (!response.ok) {
    const data = await response.json()
    throw new AuthorizationError(data.detail)
  }
}
