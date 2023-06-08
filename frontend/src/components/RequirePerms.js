import React, { useContext } from 'react'
import { Typography } from '@mui/material';

import { PermsContext, UserContext } from './HomePage'

export default function RequirePerms(props) {
  const { perms, setPerms } = useContext(PermsContext);
  const hasPerms = props.req_perms.every( perm => perms.includes(perm))
  const msg = ''
  return hasPerms
    ? props.children
    : <Typography align="center">
      No tiene los permisos necesarios para acceder. <br/> 
      Consulte con el Administrador.
    </Typography>;
};
