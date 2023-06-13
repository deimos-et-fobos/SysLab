import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import ListComponent from './ListComponent';

const API_URL = '/api/accounts/lab-users/'

export default function UserList(props) {
  const [open, setOpen] = useState({status: false, id: null});
  const navigate = useNavigate()
  const columns = [
    { field: 'email', headerName: 'Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center', renderCell: getEmail},
    { field: 'full_name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getFullName },
    { field: 'is_active', headerName: 'Activo', minWidth: 100, flex: 1, align:'center', headerAlign:'center', type:'boolean', editable:'true'},
    { field: 'is_superuser', headerName: 'Superusuario', minWidth: 150, flex: 1, align:'center', headerAlign:'center', type:'boolean'},
    { field: 'actions', type: 'actions', getActions: getActions}
  ];

  function getEmail(params) {
    const email = `${params.row.email}`;
    return  <Link
      component={RouterLink}
      to={`${params.row.id}/`}
      sx={{ '&:hover': {color: 'secondary.main'} }}
      color='secondary'
      underline='hover'
      children={email}
    />
  }
  function getFullName(params) {
    return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
  }
  function getActions(params) {
    return [
      <GridActionsCellItem icon=<EditIcon/> onClick={() => navigate(`${params.row.id}/`)} label="Edit" />,
      <GridActionsCellItem icon=<DeleteIcon/> onClick={() => setOpen({status: true, id: params.row.id})} label="Delete" />,
    ]
  }

  return (
    <ListComponent
      open={open}
      setOpen={setOpen}
      columns={columns}
      api_url={API_URL}
      title='Usuarios'
      icon=<PeopleAltIcon/>
    />
  )
};
