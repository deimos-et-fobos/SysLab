import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

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

export default function LoginPage(props) {
  const navigate = useNavigate();
  const [error, setError] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [msg, setMsg] = useState(null)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(props.logged);
  const nextPage = useLocation().state ? useLocation().state.nextPage : null ;

  useEffect(() => {
    props.logged ? navigate('/') : null;
  })

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const fetch_url = '/api/accounts/login/'
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + window.btoa(username + ':' + password),
        // 'X-CSRFToken': getCookie('csrftoken'),
      },
    };
    await fetch(fetch_url, requestOptions)
      .then((response) => {
        if (response.status == 200) {
          props.setLogged(true);
          setUsername('');
          setPassword('');
        }
        setLoginSuccess( response.status == 200 ? true : false );
        setError( response.status != 200 ? true : false);
        console.log(response);
        return response.json()
      })
      .then((data) => {
        document.cookie = `token=${data.token};domain=${document.domain}`;
        setMsg(data.detail);
        navigate(nextPage  || '/')
      });
    }

  return (
    <React.Fragment>
      <h1>Login Page</h1>
        <Alert show={error} variant='danger' onClose={() => setError(false)} dismissible>
          {msg}
        </Alert>
        <Alert show={loginSuccess} variant='success' onClose={() => setLoginSuccess(false)} dismissible>
          Successfull Login!
        </Alert>
      <Form onSubmit={handleLoginSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={username} placeholder="Email" onChange={(e) => setUsername(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" value={password} placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)}/>
        </Form.Group>
        <Button className="mb-3" variant="primary" type="submit">Login</Button>
      </Form>
    </React.Fragment>
  )
}
