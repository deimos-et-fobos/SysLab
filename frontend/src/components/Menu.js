import React from 'react'
import { NavLink } from 'react-router-dom'
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BiotechIcon from '@mui/icons-material/Biotech';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FeedIcon from '@mui/icons-material/Feed';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import LoginIcon from '@mui/icons-material/Login';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonIcon from '@mui/icons-material/Person';
import ScienceIcon from '@mui/icons-material/Science';

import MenuItem from './MenuItem'

export default function Menu(props) {
  const [open1, setOpen1] = React.useState(false);
  const handleClick1 = () => {
    setOpen1(!open1);
  };

  const { window } = props;
  const container = window !== undefined ? () => window().document.body : undefined;
  const menu = [
    { title:'Informes', icon:<FeedIcon/>, url:'protocols/'},
    { title:'Pacientes', icon:<PersonIcon/>, url:'patients/'},
    { title:'Doctores', icon:<LocalPharmacyIcon/>, url:'doctors/'},
    { title:'Obras Sociales', icon:<MedicalServicesIcon/>, url:'healthcare/'},
    { title:'Análisis', icon:<BiotechIcon/>, url:'lab-tests/'},
    { title:'Tipos de Usuarios', icon:<AccountBoxIcon/>, url:'lab-user-types/'},
    { title:'Usuarios', icon:<PeopleAltIcon/>, url:'lab-users/'},
  ]

  function drawer(mobileOpen) {
    return (
      <div>
        <Toolbar color='menu.side' sx={{ justifyContent: 'space-between' }} >
          <Typography variant="h6" >
            <ScienceIcon/> SysLab
          </Typography>
          { mobileOpen &&
            <IconButton
              color="inherit"
              aria-label="close drawer"
              edge="start"
              onClick={props.handleDrawerToggle}
              children=<CloseIcon/>
            />
          }
        </Toolbar>
        <Divider variant="middle" sx={{ borderBottomWidth: 1 }}/>
        <List>
          {menu.map((item, index) => (
            <MenuItem key={index} disablePadding url={item.url} icon={item.icon} title={item.title} handleOnClick={mobileOpen ? props.handleDrawerToggle : null}/>
          ))}
          <Divider />
          <MenuItem disablePadding url={'#'} icon={menu[0].icon} title={'Collapsable'} collapsable handleOnClick={handleClick1}/>
          <Collapse in={open1} timeout="auto" unmountOnExit>
            <List>
              {menu.map((item, index) => (
                <MenuItem key={index} nestedItem disablePadding url={item.url} icon={item.icon} title={item.title} handleOnClick={mobileOpen ? props.handleDrawerToggle : null}/>
              ))}
            </List>
          </Collapse>
        </List>
      </div>
    )
  };

  return (
    <Box
      component="nav"
      sx={{ width: { lg: props.drawerWidth }, flexShrink: { lg: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        // anchor='top'
        container={container}
        variant="temporary"
        open={props.mobileOpen}
        onClose={props.handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box'},
        }}
        PaperProps={{
          sx: {
            // bgcolor: 'text.secondary',
            bgcolor: 'menu.side',
          }
        }}
      >
        {drawer(props.mobileOpen)}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: props.drawerWidth },
        }}
        PaperProps={{
          sx: {
            // bgcolor: 'text.secondary',
            bgcolor: 'menu.side',
            // bgcolor: '#f8ffb8',
          }
        }}
        open
      >
        {drawer(props.mobileOpen)}
      </Drawer>
    </Box>
  )
}
