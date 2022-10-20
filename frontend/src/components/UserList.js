import React, { useState, useEffect } from 'react'

import DataTable from "./DataTable";

export default function UserList(props) {
  const fetch_url = '/api/accounts/users/'
  const columns = [
    // { field: 'id', headerName: 'ID', width: 80 , align:'right'},
    { field: 'email', headerName: 'Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center'},
    { field: 'full_name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getFullName },
    { field: 'is_active', headerName: 'Activo', minWidth: 100, flex: 1, align:'center', headerAlign:'center', type:'boolean', editable:'true'},
    { field: 'is_superuser', headerName: 'Superusuario', minWidth: 150, flex: 1, align:'center', headerAlign:'center', type:'boolean'},
  ];
  function getFullName(params) {
    return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
  }

  return (
    <DataTable
      columns={columns}
      fetch_url={fetch_url}
      title='Usuarios'
      titleProps={{ pb: 1 }}
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
