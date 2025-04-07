import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

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
    fetchServer('GET', `${API_URL}?entity=${entity}`, null, (data, status) => {
      if (status === 200) {
        setHasPerms(data.has_perms);
        sessionStorage.setItem(`perms_${entity}`, JSON.stringify(data.has_perms));
      } else {
        setHasPerms(undefined);
      }
    })
  }, [entity]);
  
  if (hasPerms === null) return <Typography align="center">Verificando permisos...</Typography>;
  if (!hasPerms?.view) {
    return  <Typography align="center">
              No tiene los permisos necesarios para acceder. <br/> 
              Consulte con el Administrador.
            </Typography>;
  }
  return React.cloneElement(children, { hasPerms })
};
