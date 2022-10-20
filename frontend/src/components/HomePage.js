import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


import LoginPage from './LoginPage';
import RequireAuth from './RequireAuth';
import DoctorList from './DoctorList'
import HealthcareList from './HealthcareList'
import PatientList from './PatientList'
import ProtocolList from './ProtocolList'
import LabTestList from './LabTestList'
import UserList from './UserList'
import Menu from './Menu'
import MenuBar from './MenuBar'

const drawerWidth = 240;

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

export default function HomePage(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logged, setLogged] = useState(false);

  function logout() {
    const logout_url = '/api/accounts/logout/'
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + getCookie('token'),
        // 'X-CSRFToken': getCookie('csrftoken'),
      },
    };
    fetch(logout_url, requestOptions)
    .then((response) => {
      if (response.ok) {
        setLogged(false)
      }
    });
  }

  const _userIsAuthenticated = async () => {
    const requestOptions = {
      headers: {
        'Authorization': 'Token ' + getCookie('token'),
      },
    };
    return await fetch('/api/accounts/login-status/', requestOptions)
    .then((response) => {
      return (response.status == 200) ? true : false;
    })
  }

  useEffect(() => {
    const userIsAuthenticated = async() => {
      const data = await _userIsAuthenticated();
      data ? setLogged(true) : setLogged(false);
    }
    userIsAuthenticated()
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const Dashboard = (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
        <MenuBar
          handleDrawerToggle={() => handleDrawerToggle()}
          drawerWidth={drawerWidth}
          logged={logged}
          logout={() => logout()}
        />
        <Box
          component="nav"
          sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
          aria-label="mailbox folders"
        >
          <Menu
            handleDrawerToggle={() => handleDrawerToggle()}
            drawerWidth={drawerWidth}
            mobileOpen={mobileOpen}
          />
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, width: { lg: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          <Box sx={{ mx: 5, my: 10 }} >
            <Routes>
              {/* <Route path="/" element={ logged ? <p>Home Page</p> : <LoginPage logged={logged} setLogged={setLogged} />} /> */}
              <Route element={<RequireAuth logged={logged} />} >
                <Route path="/" element={<p>Home Page</p>} />
                <Route path="doctors/" element={<DoctorList/>} />
                <Route path="healthcare/" element={<HealthcareList/>} />
                <Route path="patients/" element={<PatientList/>} />
                <Route path="protocols/" element={<ProtocolList/>} />
                <Route path="tests/" element={<LabTestList/>} />
                <Route path="users/" element={<UserList/>} />
              </Route>
            </Routes>
          </Box>
        </Box>
    </Box>
  )

  return (
    <Box>
      <Router>
        {logged ? Dashboard : <LoginPage logged={logged} setLogged={setLogged} />}
      </Router>
    </Box>
  );
}
