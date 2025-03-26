import React from 'react'
import { NavLink } from 'react-router-dom'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function MenuItem(props) {

  return (
    <ListItem
      disablePadding
      sx={{pl: () => 	props.nestedItem ? 2 : 0}}
      onClick={props.handleOnClick}
    >
        <ListItemButton component={NavLink} to={props.url}>
          <ListItemIcon>
            {props.icon}
          </ListItemIcon>
          <ListItemText primary={props.title} />
          {props.collapsable ? props.open ? <ExpandLess /> : <ExpandMore /> : null}
        </ListItemButton>
    </ListItem>
  )
}
