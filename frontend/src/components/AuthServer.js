const API_URL = '/api/accounts'

export function getCookie(cname) {
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
  constructor(message, {detail} = {}) {
  	super(message);
    this.name = 'AUTHORIZATION_ERROR'
    this.detail = detail
  };
}

export class ValidationError extends Error {
  constructor(message, {detail} = {}) {
  	super(message);
    this.name = 'VALIDATION_ERROR'
    this.detail = detail
  };
}

export const login = async({email, password, labName, method = 'POST'} = {}) => {
  let data = {}
  let requestOptions = {}
  if (method == 'POST') {
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({email:email, password: password})
    };
  }
  const response = await fetch(`${API_URL}/login/${labName}/`, requestOptions)
  try {
    data = await response.json()
  } catch {}
  if ( !response.ok ) {
    throw new ValidationError(`${response.status} ${response.statusText}`, {detail:data})
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

const METHODS = {
  list: 'GET',
  create: 'POST',
  retrieve: 'GET',
  update: 'PUT',
  destroy: 'DELETE',
}

export const fetchServer = async(url, {action = 'retrieve', values = null} = {}) => {
  let data = {};
  const method = METHODS[action];
  const body = JSON.stringify(values);
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken'),
  };
  const requestOptions = {
    method: method,
    headers: (method == 'GET') ? {} : headers,
    body: (method == 'PUT' || method == 'POST') ? body : null,
  }
  const response = await fetch(url, requestOptions);
  try {
    data = await response.json()
  } catch {}
  if ( !response.ok ) {
    throw new ValidationError(`${response.status} ${response.statusText}`, {detail:data})
  }
  return data;
}
