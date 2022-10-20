import React from 'react'
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

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      login_success: false,
      msg: undefined,
    }
    this.email = '';
    this.password = '';
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleEmailChange(e) {
    this.email = e.target.value;
  }

  handlePasswordChange(e) {
    this.password = e.target.value;
  }

  handleLoginSubmit(e) {
    e.preventDefault()
    const fetch_url = '/api/accounts/login/'
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + window.btoa(this.email + ':' + this.password),
        // 'X-CSRFToken': getCookie('csrftoken'),
      },
    };
    fetch(fetch_url, requestOptions)
      .then((response) => {
        if (response.status == 200) {
          this.email = '';
          this.password = '';
        }
        this.setState({
          login_success: response.status == 200 ? true : false,
          error: response.status != 200 ? true : false,
        });
        return response.json()
      })
      .then((data) => {
        document.cookie = 'token=' + data.token;
        this.setState({ msg: data.detail });
      });
    }

  render () {
    return <React.Fragment>
      <h1>Login Page</h1>
        <Alert show={this.state.error} variant='danger' onClose={() => this.setState({error: false})} dismissible>
          {this.state.msg}
        </Alert>
        <Alert show={this.state.login_success} variant='success' onClose={() => this.setState({login_success: false})} dismissible>
          Successfull Login!
        </Alert>
      <Form onSubmit={this.handleLoginSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Email" onChange={this.handleEmailChange}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" placeholder="Contraseña" onChange={this.handlePasswordChange}/>
        </Form.Group>
        <Button className="mb-3" variant="primary" type="submit">Login</Button>
      </Form>
    </React.Fragment>
  }
}

export default Login;
