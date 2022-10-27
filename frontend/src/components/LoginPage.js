import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import { login } from './AuthServer'
import { UserContext } from './HomePage'
import { LabContext } from './HomePage'

export default function LoginPage(props) {
  const navigate = useNavigate();
  const [error, setError] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [msg, setMsg] = useState(null)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useContext(UserContext);
  const { laboratory, setLaboratory } = useContext(LabContext);
  const nextPage = useLocation().pathname
  let { labName } = useParams()

  useEffect(() => {
    // user ? navigate(`/`) : null;
  }, [])

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    let data = { user: null, laboratory: null }
    try {
      data = await login({username, password, labName})
      setUsername('');
      setPassword('');
    } catch (err) {
      setMsg(`${err.name}: ${err.message}`);
      console.error(err);
      console.error(err.details);
    } finally {
      setUser(data.user);
      setLaboratory(data.laboratory);
      data.user ? setLoginSuccess(true) : setLoginSuccess(false);
      data.user ? setError(false) : setError(true);
      data.user ? navigate(nextPage  || '/') : null;
    }
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
