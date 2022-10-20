import React, { useState, useEffect } from 'react'

import DataTable from "./DataTable";

export default function HealthcareList(props) {
  const fetch_url = '/api/lab/healthcare/'
  const columns = [
    // { field: 'id', headerName: 'ID', width: 80 , align:'right'},
    { field: 'name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center'},
    { field: 'is_active', headerName: 'Activo', minWidth: 100, flex: 1, align:'center', headerAlign:'center', type:'boolean', editable:'true'},
  ];

  return (
    <DataTable
      columns={columns}
      fetch_url={fetch_url}
      title='Obras Sociales'
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
