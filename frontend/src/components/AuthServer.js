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

export const userAuthentication = async() => {
  const requestOptions = {
    headers: {
      'Authorization': 'Token ' + getCookie('token'),
    },
  };
  const response = await fetch(`${API_URL}/login-status/`, requestOptions)
  const data = await response.json()
  if (response.status != 200) {
    throw new AuthorizationError(data.detail)
  }
  return data.auth ? data.auth : false ; //No se si data.auth es siempre true
}

export const login = async(username, password) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + window.btoa(username + ':' + password),
      // 'X-CSRFToken': getCookie('csrftoken'),
    },
  };
  const response = await fetch(`${API_URL}/login/`, requestOptions)
  const data = await response.json()
  if (response.status != 200) {
    throw new AuthorizationError('Bad Credentials.', {details:data.detail})
  }
  document.cookie = `token=;path=/;domain=${document.domain};expires=Thu, 01-Jan-70 00:00:01 GMT;`;
  document.cookie = `token=${data.token};path=/;domain=${document.domain};`;
  return data;
}

export const logout = async() => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Token ' + getCookie('token'),
    },
  };
  const response = await fetch(`${API_URL}/logout/`, requestOptions)
  if (!response.ok) {
    const data = await response.json()
    throw new AuthorizationError(data.detail)
  }
  document.cookie = `token=;path=/;domain=${document.domain};expires=Thu, 01-Jan-70 00:00:01 GMT;`;
}
