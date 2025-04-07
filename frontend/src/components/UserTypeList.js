import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import AddButton from './AddButton';
import ListComponent from './ListComponent';
import { _hasPerms, getActionButtons } from './utils';

const API_URL = '/api/accounts/user-types/'

export default function LabUserTypeList({ hasPerms }) {
  const [open, setOpen] = useState({status: false, id: null});

  const columns = [
    { field: 'type', headerName: 'Tipo de Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center', renderCell: getType},
    { field: 'is_active', headerName: 'Activo', minWidth: 100, flex: 1, align:'center', headerAlign:'center', type:'boolean'},
    // { field: 'actions', type: 'actions', getActions: getActions}
    ];

  function getType(params) {
    const type = `${params.row.type}`;
    return  <Link
      component={RouterLink}
      to={`${params.row.id}/`}
      sx={{ '&:hover': {color: 'secondary.main'} }}
      color='secondary'
      underline='hover'
      children={type}
    />
  }

  function getActions(params) {
    return getActionButtons(params.row.id, hasPerms, setOpen);
  }

  return (
    <ListComponent
      open={open}
      setOpen={setOpen}
      columns={columns}
      api_url={API_URL}
      title='Tipos de Usuarios'
      // addButton={hasPerms.add ? <AddButton icon={<AccountBoxIcon/>} /> : null} 
    />
  )
};
