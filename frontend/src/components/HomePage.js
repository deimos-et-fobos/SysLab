import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, matchPath, useParams, useLocation, Outlet } from 'react-router-dom'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import { login } from './AuthServer';
import HealthcareForm from './HealthcareForm';
import HealthcareList from './HealthcareList';

import DoctorList from './DoctorList';
import DoctorForm from './DoctorForm';
import LabUserTypeList from './LabUserTypeList';
import LabTestList from './LabTestList'
import LoginPage from './LoginPage';
import Menu from './Menu';
import MenuBar from './MenuBar';
import Message from './Message';
import PatientForm from './PatientForm';
import PatientList from './PatientList';
import ProtocolList from './ProtocolList';
import RequirePerms from './RequirePerms';
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
export const PermsContext = createContext({
  perms: null,
  setPerms: () => {},
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
  const [perms, setPerms] = useState(null)
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
  const permsContextValue = useMemo(
    () => ({ perms, setPerms }),
    [perms]
  );

  useEffect(() => {
    login('GET', null, labName, (res, status) => {
      if (status === 200 && res.lab_member) {
        JSON.stringify(res.lab_member.user) !== JSON.stringify(user) ? setUser(res.lab_member.user) : null;
        JSON.stringify(res.lab_member.laboratory) !== JSON.stringify(laboratory) ? setLaboratory(res.lab_member.laboratory) : null;
        JSON.stringify(res.lab_member.permissions) !== JSON.stringify(perms) ? setPerms(res.lab_member.permissions) : null;
      } else {
        res.detail ? setMsg({msg: res.detail , severity:'error'}) : null;
        res.detail ? console.error(res.detail) : null;
      }
      setLoading(false);
    })
  }, [user, laboratory]);

  if (loading) {
    return <p>Loading...</p>
  }
  return (
    <Box sx={{ bgcolor: 'background' }}>
      <Router>
        <MsgContext.Provider value={msgContextValue}>
        <LabContext.Provider value={labContextValue}>
        <UserContext.Provider value={userContextValue}>
        <PermsContext.Provider value={permsContextValue}>
          <Routes>
            <Route index element=<LoginPage/> />
            <Route path=":labName/" element={user ? <Dashboard/> : <LoginPage/>} >
              <Route index element={<p>Home Page</p>} />
              <Route path="lab-user-types/" element={<LabUserTypeList/>} />
              <Route path="lab-user-types/new/" element={<LoginPage/>} />
              <Route path="doctors/" element={<Outlet/>} >
                <Route index element={<RequirePerms req_perms={['lab.list_doctor']} children=<DoctorList/>/>} />
                <Route path="new/" element={<RequirePerms req_perms={['lab.add_doctor']} children=<DoctorForm/>/>} />
                <Route path=":id/" element={<RequirePerms req_perms={['lab.view_doctor']} children=<DoctorForm/>/>} />
              </Route>
              <Route path="healthcare/" element={<Outlet/>} >
                <Route index element={<RequirePerms req_perms={['lab.list_healthcareprovider']} children=<HealthcareList/>/>} />
                <Route path="new/" element={<RequirePerms req_perms={['lab.add_healthcareprovider']} children=<HealthcareForm/>/>} />
                <Route path=":id/" element={<RequirePerms req_perms={['lab.view_healthcareprovider']} children=<HealthcareForm/>/>} />
              </Route>
              <Route path="patients/" element={<Outlet/>} >
                <Route index element={<RequirePerms req_perms={['lab.list_patient']} children=<PatientList/>/>} />
                <Route path="new/" element={<RequirePerms req_perms={['lab.add_patient','lab.list_healthcareprovider']} children=<PatientForm/>/>} />
                <Route path=":id/" element={<RequirePerms req_perms={['lab.view_patient']} children=<PatientForm/>/>} />
              </Route>
              <Route path="protocols/" element={<ProtocolList/>} />
              <Route path="tests/" element={<LabTestList/>} />
              <Route path="tests/new/" element={<h1>New Test</h1>} />
              <Route path="users/" element={<UserList/>} />
            </Route>
          </Routes>
        </PermsContext.Provider>
        </UserContext.Provider>
        </LabContext.Provider>
        </MsgContext.Provider>
      </Router>
    </Box>
  );
}
