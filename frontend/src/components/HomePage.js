import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useParams, Outlet } from 'react-router-dom'
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

export const LabContext = createContext({
  laboratory: null,
  setLaboratory: () => {},
});
export const UserContext = createContext({
  user: null,
  setUser: () => {},
});


const Dashboard = (props) => {
  console.log('hola dashboard');
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
        <MenuBar
          handleDrawerToggle={() => handleDrawerToggle()}
          drawerWidth={drawerWidth}
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

            <Outlet/>

          </Box>
        </Box>
    </Box>
  )
}

export default function HomePage(props) {
  const [user, setUser] = useState(null);
  const [laboratory, setLaboratory] = useState(null)

  const userContextValue = useMemo(
    () => ({ user, setUser }),
    [user]
  );
  const labContextValue = useMemo(
    () => ({ laboratory, setLaboratory }),
    [laboratory]
  );

  useEffect(() => {
    console.log('hola homepage');
    const userIsAuthenticated = async() => {
      const auth = await userAuthentication();
      setUser(auth);
    }
    userIsAuthenticated().catch((err) => {
      setUser(null)
      console.error(err);
    });
    console.log('authenticate',user);
  }, []);

  return (
    <Box>
      <Router>
        <LabContext.Provider value={labContextValue}>
        <UserContext.Provider value={userContextValue}>
          <Routes>
            {/* <Route index element={<LoginPage/>} /> */}
            <Route path=":labName/" element={user ? <Dashboard/> : <LoginPage/>} >
              <Route index element={<p>Home Page</p>} />
              <Route path="doctors/" element={<DoctorList/>} />
              <Route path="healthcare/" element={<HealthcareList/>} />
              <Route path="patients/" element={<PatientList/>} />
              <Route path="protocols/" element={<ProtocolList/>} />
              <Route path="tests/" element={<LabTestList/>} />
              <Route path="users/" element={<UserList/>} />
            </Route>
          </Routes>
        </UserContext.Provider>
        </LabContext.Provider>
      </Router>
    </Box>
  );
}
