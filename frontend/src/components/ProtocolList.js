import React, { useState, useContext } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import FeedIcon from '@mui/icons-material/Feed';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import ListComponent from './ListComponent';

const API_URL = '/api/lab/protocols/'

export default function ProtocolList(props) {
  const [open, setOpen] = useState({status: false, id: null});
  const columns = [
    { field: 'id', headerName: 'Protocolo', minWidth: 120, align:'center', headerAlign:'center', renderCell: getId},
    { field: 'laboratoryName', headerName: 'Laboratorio', minWidth: 130, flex: 2, align:'center', headerAlign:'center', valueGetter: getLaboratoryName},
    { field: 'user', headerName: 'Usuario', minWidth: 200, flex: 2, align:'center', headerAlign:'center'},
    { field: 'patientName', headerName: 'Paciente', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getPatientName},
    { field: 'doctorName', headerName: 'Doctor', minWidth: 200, flex: 2, align:'center', headerAlign:'center', valueGetter: getDoctorName},
    { field: 'hc_provider', headerName: 'Obra Social', minWidth: 130, flex: 2, align:'center', headerAlign:'center'},
    { field: 'is_urgent', headerName: 'Urgente', width: 100, align:'center', headerAlign:'center', type:'boolean'},
    { field: 'status', headerName: 'Estado', minWidth: 100, align:'center', headerAlign:'center'},
    { field: 'checkin_time', headerName: 'Ingresado', minWidth: 300, align:'center', headerAlign:'center', valueFormatter: checkInTimeFormatter, getApplyQuickFilterFn: null},
    { field: 'actions', type: 'actions', getActions: getActions}
  ];

  function getId(params) {
    const id = `${params.row.id}`;
    return  <Link
      component={RouterLink}
      to={`${params.row.id}/`}
      sx={{ '&:hover': {color: 'primary.main'} }}
      color='primary'
      underline='hover'
      children={id}
    />
  }
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
      title='Listados de Informes'
      icon=<FeedIcon/>
    />
  )
};
