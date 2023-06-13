import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import AddButton from './AddButton';
import ListComponent from './ListComponent';
import { PermsContext } from './HomePage';
import UserAvatar from './UserAvatar';
import { _hasPerms, getActionButtons } from './utils';

const API_URL = '/api/accounts/lab-users/';
const REQ_PERMS = {
  add: ['accounts.add_labmember'],
  change: ['accounts.change_labmember'],
  delete: ['accounts.delete_labmember'],
}

export default function PatientList(props) {
  const [open, setOpen] = useState({status: false, id: null});
  const { perms, setPerms } = useContext(PermsContext);
  const hasPerms = _hasPerms(perms, REQ_PERMS);
  const navigate = useNavigate()

  const columns = [
    { field: 'avatar', headerName: '', minWidth: 50, flex: 1, align:'center', headerAlign:'center', renderCell: getAvatar },
    { field: 'email', headerName: 'Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center', renderCell: getEmail },
    { field: 'full_name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getFullName },
    { field: 'user_type', headerName: 'Tipo de Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getUserType },
    { field: 'is_active', headerName: 'Activo', minWidth: 100, flex: 1, align:'center', headerAlign:'center', type:'boolean', editable:'true'},
    { field: 'actions', type: 'actions', getActions: getActions}
  ];

  function getAvatar(params) {
    const fullName = `${params.row.user.first_name || ''} ${params.row.user.last_name || ''}`;
    return <UserAvatar sx={{}} alt={fullName} src={params.row.user.photo_url}>{fullName}</UserAvatar>
  }

  function getEmail(params) {
    const email = `${params.row.user.email}`;
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
    return `${params.row.user.first_name || ''} ${params.row.user.last_name || ''}`;
  }

  function getUserType(params) {
    return params.row.user_type ? params.row.user_type : '- - -';
  }


  function getActions(params) {
    return getActionButtons(params.row.id, hasPerms);
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
