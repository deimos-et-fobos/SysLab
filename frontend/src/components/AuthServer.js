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

function AuthorizationException(message, details=null) {
  this.name = 'AuthorizationException';
  this.message = message;
  this.details = details;
}

export const userIsAuthenticated = async() => {
  const requestOptions = {
    headers: {
      'Authorization': 'Token ' + getCookie('token'),
    },
  };
  const logged = await fetch(`${API_URL}/login-status/`, requestOptions)
  .then((response) => {
    return (response.status == 200) ? true : false;
  });
  return logged;
}

export const login = async() => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + window.btoa(username + ':' + password),
      // 'X-CSRFToken': getCookie('csrftoken'),
    },
  };
  const status = await fetch(`${API_URL}/login/`, requestOptions)
  .then((response) => {
    if (response.status != 200){
      throw new AuthorizationException('Bad Credentials.', details=response)
    }
    return response.json()
  })
  .then((data) => {
    console.log(data);
    // document.cookie = `token=${data.token};domain=${document.domain}`;
    return data;
  });
  return status
}

export const logout = async() => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Token ' + getCookie('token'),
    },
  };
  const status = await fetch(`${API_URL}/logout/`, requestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new AuthorizationException('Logout Error', details=response)
    }
    return response
  });
}
