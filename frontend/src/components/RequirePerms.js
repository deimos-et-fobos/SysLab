import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

import axios from 'axios';
import { fetchServer } from './AuthServer';

const API_URL = '/api/accounts/check-perms/';

export default function RequirePerms({ entity, children }) {
  const [hasPerms, setHasPerms] = useState(null); // null mientras se verifica

  useEffect(() => {
    const cachedPerms = sessionStorage.getItem(`perms_${entity}`);
    if (cachedPerms !== null) {
      setHasPerms(JSON.parse(cachedPerms));
      return;
    }
    axios
      .get(API_URL, { params: { entity: entity } })
      .then((res) => {
        setHasPerms(res.data.has_perms);
        sessionStorage.setItem(`perms_${entity}`, JSON.stringify(res.data.has_perms));
      })
      .catch(() => setHasPerms(undefined));
  }, [entity]);
  console.log(hasPerms);
  
  if (hasPerms === null) return <Typography align="center">Verificando permisos...</Typography>;
  if (!hasPerms?.view) {
    return  <Typography align="center">
              No tiene los permisos necesarios para acceder. <br/> 
              Consulte con el Administrador.
            </Typography>;
  }
  return React.cloneElement(children, { hasPerms })
};
