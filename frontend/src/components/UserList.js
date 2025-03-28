import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import AddButton from './AddButton';
import ListComponent from './ListComponent';
import { UserContext } from './HomePage';
import UserAvatar from './UserAvatar';
import { _hasPerms, getActionButtons } from './utils';

const API_URL = '/api/accounts/users/';

export default function PatientList({ hasPerms }) {
  const [open, setOpen] = useState({status: false, id: null});
  const { user, setUser } = useContext(UserContext);


  const columns = [
    { field: 'avatar', headerName: '', minWidth: 50, flex: 1, align:'center', headerAlign:'center', renderCell: getAvatar },
    { field: 'email', headerName: 'Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center', renderCell: getEmail },
    { field: 'full_name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getFullName },
    { field: 'type.type', headerName: 'Tipo de Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getUserType },
    { field: 'is_active', headerName: 'Activo', minWidth: 100, flex: 1, align:'center', headerAlign:'center', type:'boolean', editable:'true'},
    { field: 'actions', type: 'actions', getActions: getActions}
  ];

  function getAvatar(params) {
    const fullName = `${params.row.first_name || ''} ${params.row.last_name || ''}`;
    return <UserAvatar sx={{}} alt={fullName} src={params.row.photo_url}>{fullName}</UserAvatar>
  }

  function getEmail(params) {
    const email = `${params.row.email}`;
    return (!hasPerms.change) ? email :
      <Link
        component={RouterLink}
        to={ `${params.row.id}/` }
        sx={{ '&:hover': {color: 'secondary.main'} }}
        color='secondary'
        underline='hover'
        children={email}
      />
  }

  function getFullName(params) {
    return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
  }

  function getUserType(params) {
    return params.row.type ? params.row.type.type : '- - -';
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
      title='Usuarios'
      addButton={hasPerms.add ? <AddButton icon={<PeopleAltIcon/>} /> : null}
    />
  )
};
