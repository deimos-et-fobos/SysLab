import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import AddButton from './AddButton';
import ListComponent from './ListComponent';
import { PermsContext } from './HomePage';
import { _hasPerms } from './utils';

const API_URL = '/api/lab/doctors/'
const REQ_PERMS = {
  add: ['lab.add_doctor'],
  change: ['lab.change_doctor'],
  delete: ['lab.delete_doctor'],
}

export default function DoctorList(props) {
  const [open, setOpen] = useState({status: false, id: null});
  const { perms, setPerms } = useContext(PermsContext);
  const hasPerms = _hasPerms(perms, REQ_PERMS);
  const navigate = useNavigate()

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
    let actions = []
    if (hasPerms.change) {
      actions.push(<GridActionsCellItem icon=<EditIcon/> onClick={() => navigate(`${params.row.id}/`)} label="Edit" />)
    }
    if (hasPerms.delete) {
      actions.push(<GridActionsCellItem icon=<DeleteIcon/> onClick={() => setOpen({status: true, id: params.row.id})} label="Delete" />)
    }
    return actions
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
