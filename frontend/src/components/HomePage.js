import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, matchPath, useParams, useLocation, Outlet } from 'react-router-dom'
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { login } from './AuthServer';
import DoctorList from './DoctorList';
import HealthcareList from './HealthcareList';
import LabUserTypeList from './LabUserTypeList';
import LabTestList from './LabTestList'
import LoginPage from './LoginPage';
import Menu from './Menu';
import MenuBar from './MenuBar';
import Message from './Message';
import PatientForm from './PatientForm';
import PatientList from './PatientList';
import ProtocolList from './ProtocolList';
import RequireAuth from './RequireAuth';
import UserList from './UserList';

export const LabContext = createContext({
  laboratory: null,
  setLaboratory: () => {},
});
export const UserContext = createContext({
  user: null,
  setUser: () => {},
});
export const MsgContext = createContext({
  msg: false,
  setMsg: () => {},
});

const Dashboard = (props) => {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { msg, setMsg } = useContext(MsgContext)
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
        <Box sx={{ px:10, py:5 }}>
          <Message />
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default function HomePage(props) {
  const [user, setUser] = useState(null);
  const [laboratory, setLaboratory] = useState(null)
  const [msg, setMsg] = useState(false)
  const [loading, setLoading] = useState(true)
  const labName = window.location.pathname.split('/').filter((e) => e != '').shift();
  const userContextValue = useMemo(
    () => ({ user, setUser }),
    [user]
  );
  const labContextValue = useMemo(
    () => ({ laboratory, setLaboratory }),
    [laboratory]
  );
  const msgContextValue = useMemo(
    () => ({ msg, setMsg }),
    [msg]
  );

  useEffect(() => {
    const userIsAuthenticated = async() => {
      let data = { user: null, laboratory: null };
      try {
        data = await login({ labName, method:'GET'});
      } catch (err) {
        console.error(err);
        console.error(err.detail)
      } finally {
        setUser(data.user);
        setLaboratory(data.laboratory);
        setLoading(false)
      }
    }
    userIsAuthenticated()
  }, []);

  if (loading) {
    return <p>Loading...</p>
  }
  return (
    <Box>
      <Router>
        <MsgContext.Provider value={msgContextValue}>
        <LabContext.Provider value={labContextValue}>
        <UserContext.Provider value={userContextValue}>
          <Routes>
            <Route index element=<LoginPage/> />
            <Route path=":labName/" element={user ? <Dashboard/> : <LoginPage/>} >
              <Route index element={<p>Home Page</p>} />
              <Route path="doctors/" element={<DoctorList/>} />
              <Route path="healthcare/" element={<HealthcareList/>} />
              <Route path="lab-user-types/" element={<LabUserTypeList/>} />
              <Route path="lab-user-types/new/" element={<LoginPage/>} />
              <Route path="patients/" element={<Outlet/>} >
                <Route index element={<PatientList/>} />
                <Route path=":id/" element={<PatientForm/>} />
                <Route path="new/" element={<PatientForm/>} />
              </Route>
              <Route path="protocols/" element={<ProtocolList/>} />
              <Route path="tests/" element={<LabTestList/>} />
              <Route path="tests/new/" element={<h1>New Test</h1>} />
              <Route path="users/" element={<UserList/>} />
            </Route>
          </Routes>
        </UserContext.Provider>
        </LabContext.Provider>
        </MsgContext.Provider>
      </Router>
    </Box>
  );
}
