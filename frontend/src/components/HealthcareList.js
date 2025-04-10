import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

import AddButton from './AddButton';
import ListComponent from './ListComponent';
import { UserContext } from './HomePage';
import { _hasPerms, getActionButtons } from './utils';

const API_URL = '/api/lab/healthcare/'

export default function HealthcareList({ hasPerms }) {
  const [open, setOpen] = useState({status: false, id: null});
  
  const columns = [
    { field: 'name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', renderCell: getName},
    { field: 'actions', type: 'actions', getActions: getActions}
    // { field: 'id', headerName: 'ID', width: 80 , align:'right'},
    // { field: 'is_active', headerName: 'Activo', minWidth: 100, flex: 1, align:'center', headerAlign:'center', type:'boolean', editable:'true'},
  ];

  function getName(params) {
    const name = `${params.row.name}`;
    return (!hasPerms.change) ? name :
      <Link
        component={RouterLink}
        to={ `${params.row.id}/` }
        sx={{ '&:hover': {color: 'secondary.main'} }}
        color='secondary'
        underline='hover'
        children={name}
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
      title='Obras Sociales'
      addButton={hasPerms.add ? <AddButton icon={<MedicalServicesIcon/>} /> : null}
    />
  )
};
