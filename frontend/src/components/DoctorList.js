import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

import AddButton from './AddButton';
import ListComponent from './ListComponent';
import { UserContext } from './HomePage';
import { _hasPerms, getActionButtons } from './utils';

const API_URL = '/api/lab/doctors/'

export default function DoctorList({ hasPerms }) {
  const [open, setOpen] = useState({status: false, id: null});

  const columns = [
    { field: 'full_name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', renderCell: getFullName },
    { field: 'specialty', headerName: 'Especialidad', minWidth: 200, flex: 2, align:'center', headerAlign:'center'},
    { field: 'medical_license', headerName: 'Matrícula', minWidth: 150, flex: 2, align:'center', headerAlign:'center'},
    { field: 'actions', type: 'actions', getActions: getActions}
  ];

  function getFullName(params) {
    const fullName = `${params.row.first_name || ''} ${params.row.last_name || ''}`;
    return (!hasPerms.change) ? fullName :
      <Link
        component={RouterLink}
        to={`${params.row.id}/`}
        sx={{ '&:hover': {color: 'secondary.main'} }}
        color='secondary'
        underline='hover'
        children={fullName}
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
      title='Doctores'
      addButton={hasPerms.add ? <AddButton icon={<LocalPharmacyIcon/>} /> : null}
    />
  )
};
