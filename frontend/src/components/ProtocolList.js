import React, { useState, useEffect } from 'react'

import DataTable from "./DataTable";

export default function ProtocolList(props) {
  const fetch_url = '/api/lab/protocols/'
  const columns = [
    { field: 'id', headerName: 'Protocolo', minWidth: 120, align:'right', headerAlign:'center'},
    { field: 'laboratoryName', headerName: 'Laboratorio', minWidth: 130, flex: 2, align:'center', headerAlign:'center', valueGetter: getLaboratoryName},
    { field: 'user', headerName: 'Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center'},
    { field: 'patientName', headerName: 'Paciente', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getPatientName},
    { field: 'doctorName', headerName: 'Doctor', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getDoctorName},
    { field: 'hc_provider', headerName: 'Obra Social', minWidth: 130, flex: 2, align:'center', headerAlign:'center'},
    { field: 'is_urgent', headerName: 'Urgente', width: 100, align:'center', headerAlign:'center', type:'boolean'},
    { field: 'status', headerName: 'Estado', minWidth: 100, align:'center', headerAlign:'center'},
    { field: 'checkin_time', headerName: 'Ingresado', minWidth: 300, align:'center', headerAlign:'center', valueFormatter: checkInTimeFormatter, getApplyQuickFilterFn: null},
  ];
  function checkInTimeFormatter(params) {
    const d = new Date(params.value)
    return (
      ("00" + d.getDate()).slice(-2) + "/" +
      ("00" + (d.getMonth() + 1)).slice(-2) + "/" +
      d.getFullYear() + " " +
      ("00" + d.getHours()).slice(-2) + ":" +
      ("00" + d.getMinutes()).slice(-2) + ":" +
      ("00" + d.getSeconds()).slice(-2)
    )
  }

  function getDoctorName(params) {
    return `${params.row.doctor.first_name || ''} ${params.row.doctor.last_name || ''}`;
  }
  function getLaboratoryName(params) {
    return `${params.row.laboratory.name}`;
  }
  function getPatientName(params) {
    return `${params.row.patient.first_name || ''} ${params.row.patient.last_name || ''}`;
  }


  return (
    <DataTable
      columns={columns}
      fetch_url={fetch_url}
      title='Listado de Informes'
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
