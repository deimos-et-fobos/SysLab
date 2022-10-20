import React, { useState, useEffect } from 'react'

import DataTable from "./DataTable";

export default function PatientList(props) {
  const fetch_url = '/api/lab/patients/'
  const columns = [
    // { field: 'id', headerName: 'ID', width: 80 , align:'right'},
    { field: 'full_name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getFullName },
    { field: 'id_type', headerName: 'Tipo de ID', minWidth: 150, flex: 1, align:'center', headerAlign:'center'},
    { field: 'id_number', headerName: 'ID', minWidth: 150, flex: 1, align:'center', headerAlign:'center'},
    { field: 'healthcare_provider', headerName: 'Obra Social', minWidth: 200, flex: 1, align:'center', headerAlign:'center'},
    { field: 'age', headerName: 'Edad', minWidth: 100, flex: 1, align:'center', headerAlign:'center'},
    { field: 'birthday', headerName: 'Fecha de Nacimiento', minWidth: 250, flex: 1, align:'center', headerAlign:'center', valueFormatter: birthdayFormatter, getApplyQuickFilterFn: null},
  ];
  function getFullName(params) {
    return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
  }
  function birthdayFormatter(params) {
    const date = new Date(params.value)
    return (
      ("00" + date.getDate()).slice(-2) + "/" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
      date.getFullYear()
    )
  }

  return (
    <DataTable
      columns={columns}
      fetch_url={fetch_url}
      title='Pacientes'
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
