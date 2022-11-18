import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import AddButton from "./AddButton";
import DataTable from "./DataTable";
import { ConfirmDelete } from './FormComponents'
import { MsgContext } from './HomePage'

import { fetchServer } from './AuthServer'

const API_URL = '/api/accounts/lab-user-types/'

export default function LabUserTypeList(props) {
  const [open, setOpen] = useState({status: false, id: null});
  const [rows, setRows] = useState(null);
  const { msg, setMsg } = useContext(MsgContext);
  const navigate = useNavigate()
  const pathname = useLocation().pathname

  const handleDelete = async () => {
    const id = open.id;
    try {
      const data = await fetchServer(API_URL + `${id}/`, {action: 'destroy'});
      setRows(rows.filter(row => row.id !== id));
      setMsg({msg:'Successfully deleted!', severity:'success'});
    } catch (err) {
      setMsg({msg:'Could not delete!', severity:'error'});
      console.error(err);
      console.error(err.detail);
    }
    setOpen({status: false});
  }
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
      sx={{ '&:hover': {color: 'primary.main'} }}
      color='primary'
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
    <div>
      <DataTable
        columns={columns}
        rows={rows}
        setRows={setRows}
        fetch_url={API_URL}
        title='Tipos de Usuarios'
        titleProps={{ pb: 1 }}
        addButton={<AddButton icon={<AccountBoxIcon/>} />}
        sx={{
          p: 2,
          boxShadow: 2,
          bgcolor: 'white',
          // border: 2,
          borderColor:  'secondary.dark',
        }}
      />
      <ConfirmDelete
        open={open.status}
        handleDelete={handleDelete}
        handleCancel={() => setOpen({status:false})}
      />
    </div>
  )
};
