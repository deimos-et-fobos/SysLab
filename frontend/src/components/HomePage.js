import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'

import Login from './Login'
import Create from './Create'
import Info from './Info'

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="create/" element={<Create />} />
        <Route path="info/" element={<Info />} />
      </Routes>

    </Router>
  }
}

export default HomePage;
