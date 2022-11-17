import React, { useState, useEffect } from 'react'

import AddButton from './AddButton';
import DataTable from "./DataTable";
import AccountBoxIcon from '@mui/icons-material/AccountBox';

export default function LabUserTypeList(props) {
  const fetch_url = '/api/accounts/lab-user-types/'
  const columns = [
    { field: 'type', headerName: 'Tipo de Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center'},
    { field: 'laboratoryName', headerName: 'Laboratorio', minWidth: 130, flex: 2, align:'center', headerAlign:'center', valueGetter: getLaboratoryName},
    { field: 'is_active', headerName: 'Activo', minWidth: 100, flex: 1, align:'center', headerAlign:'center', type:'boolean'},
  ];
  function getLaboratoryName(params) {
    return `${params.row.laboratory.name}`;
  }

  return (
    <DataTable
      columns={columns}
      fetch_url={fetch_url}
      title='Tipos de Usuarios'
      titleProps={{ pb: 1 }}
      addButton={<AddButton msg={'Redireccionando a NewLabUserType.'} icon={<AccountBoxIcon/>}/>}
      sx={{
        p: 2,
        boxShadow: 2,
        bgcolor: 'white',
        // border: 2,
        // borderColor: 'primary.light',
      }}
    />
  )
};
