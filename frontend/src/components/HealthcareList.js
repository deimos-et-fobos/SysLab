import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import ListComponent from './ListComponent';

const API_URL = '/api/lab/healthcare/'

export default function HealthcareList(props) {
  const [open, setOpen] = useState({status: false, id: null});
  const navigate = useNavigate()
  const columns = [
    // { field: 'id', headerName: 'ID', width: 80 , align:'right'},
    { field: 'name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', renderCell: getName},
    { field: 'is_active', headerName: 'Activo', minWidth: 100, flex: 1, align:'center', headerAlign:'center', type:'boolean', editable:'true'},
    { field: 'actions', type: 'actions', getActions: getActions}
  ];

  function getName(params) {
    const name = `${params.row.name}`;
    return  <Link
      component={RouterLink}
      to={`${params.row.id}/`}
      sx={{ '&:hover': {color: 'secondary.main'} }}
      color='secondary'
      underline='hover'
      children={name}
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
      title='Obras Sociales'
      icon=<MedicalServicesIcon/>
    />
  )
};
