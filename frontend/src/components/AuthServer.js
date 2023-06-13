const API_URL = '/api/accounts'

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

function getFormData(data) {
  const formData = new FormData();
  Object.keys(data).forEach(key => { 
    if (key === 'user' ) {
      Object.keys(data[key]).forEach(subKey => {
        formData.append(`user.${subKey}`, data[key][subKey]);
      });
    } else {
      formData.append(key, data[key])
    }
  });
  return formData;
}

export class AuthorizationError extends Error {
  constructor(message, detail) {
  	super(message);
    this.name = 'AUTHORIZATION_ERROR';
    this.detail = detail ? detail : null;
  };
}

export class ValidationError extends Error {
  constructor(message, detail) {
  	super(message);
    this.name = 'VALIDATION_ERROR';
    this.detail = detail ? detail : null;
  };
}

export const login = async(method, data, labName, callback) => {
  const url = `${API_URL}/login/${labName}/`;
  await fetchServer(method, url, data, callback);
}

export const logout = async(callback) => {
  const url = `${API_URL}/logout/`
  await fetchServer('GET', url, null, callback);
}

export const fetchServer = async(method, url, data, callback) => {
  let body, headers = {}, response;
  let multipart = data?.multipart ? true : false;
  if (multipart) {
    body = data ? getFormData(data) : null;
  } else {
    body = data ? JSON.stringify(data) : null;
    headers['Content-Type'] = 'application/json'
  }
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    headers['X-CSRFToken'] = csrftoken;
  }
  const requestOptions = {
    method: method,
    headers: headers,
    body: body,
  }
  try {
    data = {};
    response = await fetch(url, requestOptions);
    if (response.status !== 204) {
      data = await response.json();
      console.log('Data: ', data);
    }
    callback(data,response.status);
  } catch (error) {
    console.error('There was an error', error);
    throw new ValidationError('There was an error', error)
  }
}
