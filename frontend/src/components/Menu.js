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
import BiotechIcon from '@mui/icons-material/Biotech';
import FeedIcon from '@mui/icons-material/Feed';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonIcon from '@mui/icons-material/Person';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ScienceIcon from '@mui/icons-material/Science';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import { teal } from '@mui/material/colors';

import MenuItem from './MenuItem'

export default function Menu(props) {
  const [open1, setOpen1] = React.useState(false);
  const handleClick1 = () => {
    setOpen1(!open1);
  };

  const { window } = props;
  const container = window !== undefined ? () => window().document.body : undefined;
  const menu = ['Login','Informes', 'Pacientes', 'Doctores', 'Obras Sociales', 'Análisis', 'Usuarios']
  const icons = [<LoginIcon/>,<FeedIcon/>, <PersonIcon/>, <LocalPharmacyIcon/>, <MedicalServicesIcon/>, <BiotechIcon/>, <PeopleAltIcon/>]
  const urls = ['/', 'protocols/', 'patients/','doctors/','healthcare/','tests/','users/']

  const drawer = (
    <div>
      <Toolbar color={teal['200']} sx={{ justifyContent: 'space-between' }} >
        <Typography variant="h6" >
          <ScienceIcon/> SysLab
        </Typography>
        <IconButton
          color="inherit"
          aria-label="close drawer"
          edge="start"
          onClick={props.handleDrawerToggle}
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Divider variant="middle" sx={{ borderBottomWidth: 1 }}/>
      <List>
        {menu.map((text, index) => (
          <MenuItem key={text} disablePadding url={urls[index]} icon={icons[index]} text={text} handleOnClick={props.handleDrawerToggle}/>
        ))}
        <Divider />
        <MenuItem disablePadding url={'users/'} icon={icons[0]} text={'Collapsable'} collapsable handleOnClick={handleClick1}/>
        <Collapse in={open1} timeout="auto" unmountOnExit>
          <List>
            {menu.map((text, index) => (
              <MenuItem key={text} nestedItem disablePadding url={urls[index]} icon={icons[index]} text={text} handleOnClick={props.handleDrawerToggle}/>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );

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
            bgcolor: teal['200'],
          }
        }}
      >
        {drawer}
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
            bgcolor: teal['200'],
            // bgcolor: '#f8ffb8',
          }
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}
