import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import AddButton from './AddButton';
import ListComponent from './ListComponent';
import { PermsContext } from './HomePage';
import { _hasPerms } from './utils';

const API_URL = '/api/lab/healthcare/'
const REQ_PERMS = {
  add: ['lab.add_healthcareprovider'],
  change: ['lab.change_healthcareprovider'],
  delete: ['lab.delete_healthcareprovider'],
}

export default function HealthcareList(props) {
  const [open, setOpen] = useState({status: false, id: null});
  const { perms, setPerms } = useContext(PermsContext);
  const hasPerms = _hasPerms(perms, REQ_PERMS);
  const navigate = useNavigate()
  
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
      title='Obras Sociales'
      addButton={hasPerms.add ? <AddButton icon={<MedicalServicesIcon/>} /> : null}
    />
  )
};
