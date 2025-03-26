import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { logout } from './AuthServer'
import { MsgContext, UserContext } from './HomePage'

export default function MenuBar(props) {
  const { user, setUser } = useContext(UserContext);
  const { msg, setMsg } = useContext(MsgContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout((res, status) => {
      if (status === 200) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        setUser(null)
        navigate(`/`)
      } else {
        res.detail ? setMsg({msg: res.detail , severity:'error'}) : null;
        res.detail ? console.error(res.detail) : null;
      }
    })  
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { lg: `calc(100% - ${props.drawerWidth}px)` },
        ml: { lg: `${props.drawerWidth}px` },
        // bgcolor: 'secondary.main',
        bgcolor: 'menu.top',
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
        {user ?
          <div>
            <Tooltip title={`${user.first_name} ${user.last_name}`}>
              <IconButton color="inherit" onClick={null} sx={{ px: 2 }}>
                <Avatar alt="Remy Sharp" src={user.photo_url} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout} sx={{ p: 0 }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </div>
        : null }
      </Toolbar>
    </AppBar>
  )
}
