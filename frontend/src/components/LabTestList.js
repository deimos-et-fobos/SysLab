import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import BiotechIcon from '@mui/icons-material/Biotech';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import ListComponent from './ListComponent';

const API_URL = '/api/lab/tests/'

export default function LabTestList(props) {
  const [open, setOpen] = useState({status: false, id: null});
  const columns = [
    { field: 'code', headerName: 'Código', minWidth: 150, flex: 1, align:'center', headerAlign:'center', renderCell: getCode},
    { field: 'name', headerName: 'Nombre', minWidth: 300, flex: 2, align:'center', headerAlign:'center'},
    { field: 'ub', headerName: 'UB', minWidth: 100, flex: 1, align:'center', headerAlign:'center'},
    { field: 'method', headerName: 'Método', minWidth: 200, flex: 2, align:'center', headerAlign:'center'},
    { field: 'price', headerName: 'Precio', minWidth: 150, flex: 1, align:'center', headerAlign:'center', type:'number', valueFormatter: priceFormatter},
    { field: 'actions', type: 'actions', getActions: getActions}
    ];
  function priceFormatter(params) {
    return `$${Number(params.value).toFixed(2)}`
  }

  function getCode(params) {
    const code = `${params.row.code}`;
    return  <Link
      component={RouterLink}
      to={`${params.row.id}/`}
      sx={{ '&:hover': {color: 'primary.main'} }}
      color='primary'
      underline='hover'
      children={code}
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
      title='Listado de Análisis'
      icon=<BiotechIcon/>
    />
  )
};
