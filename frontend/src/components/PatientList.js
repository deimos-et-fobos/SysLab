import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import AddButton from './AddButton';
import ListComponent from './ListComponent';
import { PermsContext } from './HomePage';
import { _hasPerms } from './utils';

const API_URL = '/api/lab/patients/';
const REQ_PERMS = {
  add: ['lab.add_patient','lab.list_healthcareprovider'],
  change: ['lab.change_patient','lab.list_healthcareprovider'],
  delete: ['lab.delete_patient'],
}

export default function PatientList(props) {
  const [open, setOpen] = useState({status: false, id: null});
  const { perms, setPerms } = useContext(PermsContext);
  const hasPerms = _hasPerms(perms, REQ_PERMS);
  const navigate = useNavigate()

  const columns = [
    { field: 'full_name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', renderCell: getFullName},
    { field: 'id_type', headerName: 'Tipo de ID', minWidth: 150, flex: 1, align:'center', headerAlign:'center'},
    { field: 'id_number', headerName: 'ID', minWidth: 150, flex: 1, align:'center', headerAlign:'center'},
    { field: 'healthcare_provider', headerName: 'Obra Social', minWidth: 200, flex: 1, align:'center', headerAlign:'center'},
    { field: 'age', headerName: 'Edad', minWidth: 100, flex: 1, align:'center', headerAlign:'center'},
    { field: 'birthday', headerName: 'Fecha de Nacimiento', minWidth: 250, flex: 1, align:'center', headerAlign:'center', valueFormatter: birthdayFormatter, getApplyQuickFilterFn: null},
    { field: 'actions', type: 'actions', getActions: getActions}
  ];

  function getFullName(params) {
    const fullName = `${params.row.first_name || ''} ${params.row.last_name || ''}`;
    return (!hasPerms.change) ? fullName :
      <Link
        component={RouterLink}
        to={ `${params.row.id}/` }
        sx={{ '&:hover': {color: 'secondary.main'} }}
        color='secondary'
        underline='hover'
        children={fullName}
      />
  }

  function birthdayFormatter(params) {
    const date = new Date(params.value)
    return (
      ("00" + date.getDate()).slice(-2) + "/" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
      date.getFullYear()
    )
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
      title='Pacientes'
      addButton={hasPerms.add ? <AddButton icon={<PersonIcon/>} /> : null}
    />
  )
};
