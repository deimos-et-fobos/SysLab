import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import ListComponent from './ListComponent';

const API_URL = '/api/accounts/lab-user-types/'

export default function LabUserTypeList(props) {
  const [open, setOpen] = useState({status: false, id: null});
  const navigate = useNavigate()
  const columns = [
    { field: 'type', headerName: 'Tipo de Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center', renderCell: getType},
    { field: 'laboratoryName', headerName: 'Laboratorio', minWidth: 130, flex: 2, align:'center', headerAlign:'center', valueGetter: getLaboratoryName},
    { field: 'is_active', headerName: 'Activo', minWidth: 100, flex: 1, align:'center', headerAlign:'center', type:'boolean'},
    { field: 'actions', type: 'actions', getActions: getActions}
    ];
  function getLaboratoryName(params) {
    return `${params.row.laboratory.name}`;
  }

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
      title='Tipos de Usuarios'
      icon=<AccountBoxIcon/>
    />
  )
};
