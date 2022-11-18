import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import AddButton from "./AddButton";
import DataTable from "./DataTable";
import { ConfirmDelete } from './FormComponents'
import { MsgContext } from './HomePage'

import { fetchServer } from './AuthServer'

const API_URL = '/api/accounts/users/'

export default function DUserList(props) {
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
    { field: 'email', headerName: 'Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center', renderCell: getEmail},
    { field: 'full_name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getFullName },
    { field: 'is_active', headerName: 'Activo', minWidth: 100, flex: 1, align:'center', headerAlign:'center', type:'boolean', editable:'true'},
    { field: 'is_superuser', headerName: 'Superusuario', minWidth: 150, flex: 1, align:'center', headerAlign:'center', type:'boolean'},
    { field: 'actions', type: 'actions', getActions: getActions}
  ];

  function getEmail(params) {
    const email = `${params.row.email}`;
    return  <Link
      component={RouterLink}
      to={`${params.row.id}/`}
      sx={{ '&:hover': {color: 'primary.main'} }}
      color='primary'
      underline='hover'
      children={email}
    />
  }
  function getFullName(params) {
    return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
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
        title='Usuarios'
        titleProps={{ pb: 1 }}
        addButton={<AddButton icon={<PeopleAltIcon/>} />}
        sx={{
          p: 2,
          boxShadow: 2,
          bgcolor: 'white',
          // border: 2,
          borderColor:  'primary.dark',
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
