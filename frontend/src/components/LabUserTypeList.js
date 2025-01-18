import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import AddButton from './AddButton';
import ListComponent from './ListComponent';
import { PermsContext } from './HomePage';
import { _hasPerms, getActionButtons } from './utils';

const API_URL = '/api/accounts/lab-user-types/'
const REQ_PERMS = {
  add: ['lab.add_labusertype'],
  change: ['lab.change_labusertype'],
  delete: ['lab.delete_labusertype'],
}

export default function LabUserTypeList(props) {
  const [open, setOpen] = useState({status: false, id: null});
  const { perms, setPerms } = useContext(PermsContext);
  const hasPerms = _hasPerms(perms, REQ_PERMS);

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
    return getActionButtons(params.row.id, hasPerms, setOpen);
  }


  return (
    <ListComponent
      open={open}
      setOpen={setOpen}
      columns={columns}
      api_url={API_URL}
      title='Tipos de Usuarios'
      addButton={hasPerms.add ? <AddButton icon={<AccountBoxIcon/>} /> : null}
    />
  )
};
