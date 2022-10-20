import React, { useState, useEffect } from 'react'

import DataTable from "./DataTable";

export default function LabTestList(props) {
  const fetch_url = '/api/lab/tests/'
  const columns = [
    // { field: 'id', headerName: 'ID', width: 80 , align:'right'},
    // { field: 'full_name', headerName: 'Nombre', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getFullName },
    { field: 'code', headerName: 'Código', minWidth: 150, flex: 1, align:'center', headerAlign:'center'},
    { field: 'name', headerName: 'Nombre', minWidth: 300, flex: 2, align:'center', headerAlign:'center'},
    { field: 'ub', headerName: 'UB', minWidth: 100, flex: 1, align:'center', headerAlign:'center'},
    { field: 'method', headerName: 'Método', minWidth: 200, flex: 2, align:'center', headerAlign:'center'},
    { field: 'price', headerName: 'Precio', minWidth: 150, flex: 1, align:'center', headerAlign:'center', type:'number', valueFormatter: priceFormatter},
  ];
  function priceFormatter(params) {
    return `$${Number(params.value).toFixed(2)}`
  }
  function getFullName(params) {
    return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
  }

  return (
    <DataTable
      columns={columns}
      fetch_url={fetch_url}
      title='Listado de Análisis'
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
