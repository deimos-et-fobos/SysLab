import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useSearchParams } from 'react-router-dom'
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
import { userAuthentication } from './AuthServer'

const drawerWidth = 240;

export default function HomePage(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const userIsAuthenticated = async() => {
      const auth = await userAuthentication();
      setLogged(auth);
    }
    userIsAuthenticated().catch((err) => {
      setLogged(false)
      console.error(err);
    });
  });

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
          setLogged={() => setLogged()}
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
