import React, { useContext } from 'react'
import { Typography } from '@mui/material';

import { UserContext } from './HomePage'

export default function RequirePerms(props) {
  const { user, setUser } = useContext(UserContext);
  const hasPerms = props.req_perms.every( perm => user.permissions.includes(perm))
  const msg = ''
  return hasPerms
    ? props.children
    : <Typography align="center">
      No tiene los permisos necesarios para acceder. <br/> 
      Consulte con el Administrador.
    </Typography>;
};
