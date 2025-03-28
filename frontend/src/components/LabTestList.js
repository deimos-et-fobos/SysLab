import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import BiotechIcon from '@mui/icons-material/Biotech';

import AddButton from './AddButton';
import ListComponent from './ListComponent';
import { UserContext } from './HomePage';
import { _hasPerms, getActionButtons } from './utils';

const API_URL = '/api/lab/lab-tests/'

export default function LabTestList({ hasPerms }) {
  const [open, setOpen] = useState({status: false, id: null});
  const { user, setUser } = useContext(UserContext);
  
  const columns = [
    { field: 'code', headerName: 'Código', minWidth: 150, flex: 1, align:'center', headerAlign:'center', renderCell: getCode},
    { field: 'name', headerName: 'Nombre', minWidth: 300, flex: 2, align:'center', headerAlign:'center'},
    { field: 'ub', headerName: 'UB', minWidth: 100, flex: 1, align:'center', headerAlign:'center'},
    { field: 'group', headerName: 'Grupo', minWidth: 200, flex: 2, align:'center', headerAlign:'center'},
    { field: 'type', headerName: 'Type', minWidth: 200, flex: 2, align:'center', headerAlign:'center'},
    // { field: 'price', headerName: 'Precio', minWidth: 150, flex: 1, align:'center', headerAlign:'center', type:'number', valueFormatter: priceFormatter},
    { field: 'actions', type: 'actions', getActions: getActions}
    ];

  // function priceFormatter(params) {
  //   return `$${Number(params.value).toFixed(2)}`
  // }

  function getCode(params) {
    const code = `${params.row.code}`;
    return  <Link
      component={RouterLink}
      to={`${params.row.id}/`}
      sx={{ '&:hover': {color: 'secondary.main'} }}
      color='secondary'
      underline='hover'
      children={code}
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
      title='Listado de Análisis'
      addButton={hasPerms.add ? <AddButton icon={<BiotechIcon/>} /> : null}
    />
  )
};
