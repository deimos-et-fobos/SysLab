import React from "react";
import Container from 'react-bootstrap/Container';

import HomePage from "./HomePage";

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Container style={{ backgroundColor: 'cyan' }}>
        <HomePage/>
      </Container>
    )
  }
}
