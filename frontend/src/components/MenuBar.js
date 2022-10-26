import React, { useState, useEffect, useContext } from 'react'
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { teal } from '@mui/material/colors';

import { logout as _logout } from './AuthServer'
import { LabContext } from './HomePage'
import { UserContext } from './HomePage'

export default function MenuBar(props) {
  const { user, setUser } = useContext(UserContext);
  const { laboratory, setLaboratory } = useContext(LabContext);

  const logout = async () => {
    await _logout().catch(console.error)
    setUser(null)
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { lg: `calc(100% - ${props.drawerWidth}px)` },
        ml: { lg: `${props.drawerWidth}px` },
        // bgcolor: 'secondary.main',
        bgcolor: teal['700'],
      }}
      // color={teal[800]}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={props.handleDrawerToggle}
          sx={{ mr: 2, display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {laboratory.name}
        </Typography>
        {user ?
          <div>
            <IconButton onClick={()=>{}} sx={{ p: 1 }}>
              <Avatar alt="Remy Sharp" src={user.photo_url} />
            </IconButton>
            <IconButton onClick={logout} sx={{ p: 0 }}>
              <LogoutIcon />
            </IconButton>
          </div>
        : null }
      </Toolbar>
    </AppBar>
  )
}
