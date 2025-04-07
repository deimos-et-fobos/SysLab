import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, matchPath, useParams, useLocation, Outlet } from 'react-router-dom'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import { login } from './AuthServer';
import DoctorList from './DoctorList';
import DoctorForm from './DoctorForm';
import HealthcareForm from './HealthcareForm';
import HealthcareList from './HealthcareList';
import LabTestForm from './LabTestForm';
import LabTestList from './LabTestList';
import UserList from './UserList';
import UserForm from './UserForm';
import LoginPage from './LoginPage';
import Menu from './Menu';
import MenuBar from './MenuBar';
import Message from './Message';
import PatientForm from './PatientForm';
import PatientList from './PatientList';
import RequirePerms from './RequirePerms';


import UserTypeList from './UserTypeList';
import ProtocolList from './ProtocolList';

export const MsgContext = createContext({
  msg: false,
  setMsg: () => {},
});
export const UserContext = createContext({
  user: null,
  setUser: () => {},
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
  const [user, setUser] = useState(null)
  const [msg, setMsg] = useState(false)
  const [loading, setLoading] = useState(true)
  const msgContextValue = useMemo(
    () => ({ msg, setMsg }),
    [msg]
  );
  const userContextValue = useMemo(
    () => ({ user, setUser }),
    [user]
  );

  useEffect(() => {
    login('GET', null, (res, status) => {
      if (status === 200 && res.user) {
        JSON.stringify(res.user) !== JSON.stringify(user) ? setUser(res.user) : null;
      } else {
        res.detail ? setMsg({msg: res.detail , severity:'error'}) : null;
        res.detail ? console.error(res.detail) : null;
      }
      setLoading(false);
    })
  });

  if (loading) {
    return <p>Loading...</p>
  }
  return (
    <Box sx={{ bgcolor: 'background' }}>
      <Router>
        <MsgContext.Provider value={msgContextValue}>
        <UserContext.Provider value={userContextValue}>
        <Routes>
          <Route element={user ? <Dashboard /> : <LoginPage />}>
            <Route index element={<p>Welcome to SysLab DashBoard</p>} />

            {[
              { path: "doctors", entity: "doctor", list: <DoctorList />, form: <DoctorForm /> },
              { path: "healthcare", entity: "healthcareprovider", list: <HealthcareList />, form: <HealthcareForm /> },
              { path: "users", entity: "user", list: <UserList />, form: <UserForm />, hasNew: false },
              { path: "patients", entity: "patient", list: <PatientList />, form: <PatientForm /> },
              { path: "lab-tests", entity: "labtest", list: <LabTestList />, form: <LabTestForm /> }
            ].map(({ path, entity, list, form, hasNew = true }) => (
              <Route key={path} path={`${path}/`} element={<Outlet />}>
                <Route index element={<RequirePerms entity={entity}>{list}</RequirePerms>} />
                {hasNew && <Route path="new/" element={<RequirePerms entity={entity}>{form}</RequirePerms>} />}
                <Route path=":id/" element={<RequirePerms entity={entity}>{form}</RequirePerms>} />
              </Route>
            ))}
            <Route path="user-types/" element={<RequirePerms entity='usertype'>{<UserTypeList/>}</RequirePerms>} />

            <Route path="protocols/" element={<ProtocolList />} />
          </Route>
        </Routes>
        </UserContext.Provider>
        </MsgContext.Provider>
      </Router>
    </Box>
  );
}
