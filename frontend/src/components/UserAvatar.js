import React from 'react'
import Avatar from '@mui/material/Avatar';

export default function UserAvatar(props) {
  let sx = { 
    width: 32, 
    height: 32,
    bgcolor: 'secondary.dark'
  }
  const getInitials = (str) => {
    let initials = []
    if (str) {
      str.split(' ').forEach(word => { initials += word[0]; });
      return initials.toUpperCase();
    }
    return null;
  }
  return <Avatar sx={{...sx, ...props.sx}} alt={props.alt} src={props.src} >{getInitials(props.children)}</Avatar>
}
