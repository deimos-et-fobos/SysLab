import React, { useState, useEffect } from 'react'

import DataTable from "./DataTable";

export default function DoctorList(props) {
  const fetch_url = '/api/lab/doctors/'
  const columns = [
    // { field: 'id', headerName: 'ID', width: 80 , align:'right'},
    { field: 'full_name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getFullName },
    { field: 'specialty', headerName: 'Especialidad', minWidth: 200, flex: 2, align:'center', headerAlign:'center'},
    { field: 'medical_license', headerName: 'Matrícula', minWidth: 150, flex: 2, align:'center', headerAlign:'center'},
  ];
  function getFullName(params) {
    return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
  }

  return (
    <DataTable
      columns={columns}
      fetch_url={fetch_url}
      title='Doctores'
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
