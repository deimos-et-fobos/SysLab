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
import LabUserList from './LabUserList';
import LabUserForm from './LabUserForm';
import LoginPage from './LoginPage';
import Menu from './Menu';
import MenuBar from './MenuBar';
import Message from './Message';
import PatientForm from './PatientForm';
import PatientList from './PatientList';
import RequirePerms from './RequirePerms';


import UserTypeList from './UserTypeList';
import ProtocolList from './ProtocolList';
import UserList from './UserList';

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
  const [perms, setPerms] = useState(null)
  const [msg, setMsg] = useState(false)
  const [loading, setLoading] = useState(true)
  const msgContextValue = useMemo(
    () => ({ msg, setMsg }),
    [msg]
  );
  const permsContextValue = useMemo(
    () => ({ perms, setPerms }),
    [perms]
  );

  useEffect(() => {
    login('GET', null, (res, status) => {
      if (status === 200 && res.user) {
        JSON.stringify(res.perms) !== JSON.stringify(perms) ? setPerms(res.perms) : null;
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
        <PermsContext.Provider value={permsContextValue}>
          <Routes>
            <Route index element={user ? <Dashboard/> : <LoginPage/>} >
              <Route index element={<p>Home Page</p>} />
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
              <Route path="users/" element={<Outlet/>} >
                <Route index element={<RequirePerms req_perms={['accounts.list_user']} children=<UserList/>/>} />
                <Route path=":id/" index element={<RequirePerms req_perms={['accounts.view_user','accounts.list_user']} children=<UserForm/>/>} />
              </Route>
              <Route path="patients/" element={<Outlet/>} >
                <Route index element={<RequirePerms req_perms={['lab.list_patient']} children=<PatientList/>/>} />
                <Route path="new/" element={<RequirePerms req_perms={['lab.add_patient','lab.list_healthcareprovider']} children=<PatientForm/>/>} />
                <Route path=":id/" element={<RequirePerms req_perms={['lab.view_patient']} children=<PatientForm/>/>} />
              </Route>

              <Route path="lab-tests/" element={<Outlet/>} >
                <Route index element={<RequirePerms req_perms={['lab.list_labtest']} children=<LabTestList/>/>} />
                <Route path="new/" element={<RequirePerms req_perms={['lab.add_labtest','lab.list_labtest','lab.list_labtestgroup']} children=<LabTestForm/>/>} />
                <Route path=":id/" element={<RequirePerms req_perms={['lab.view_labtest']} children=<LabTestForm/>/>} />
              </Route>

              // <Route path="lab-user-types/" element={<LabUserTypeList/>} />
              // <Route path="lab-user-types/new/" element={<LoginPage/>} />
              // <Route path="protocols/" element={<ProtocolList/>} />
            </Route>
          </Routes>
        </PermsContext.Provider>
        </MsgContext.Provider>
      </Router>
    </Box>
  );
}
