import React from 'react'
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import { fetchServer } from "./AuthServer";

export const getInitialValues = async(url, id, initialValues, setMsg, setInitialValues, choices=false) => {
  let URL = url + (id ? `${id}/` : 'new/');
  console.log(URL);
  console.log(id||choices);
  
  if (id || choices) {
    fetchServer('GET', URL, null, (res, status) => {
      if (status === 200) {
        let values = { ...initialValues };
        Object.keys(res).forEach(
          (key) => { 
            (res[key] !== null) ? values[key] = res[key] : null; }
        );
        setInitialValues(values);
      } else {
        res.detail ? setMsg({msg: res.detail , severity:'error'}) : null;
        console.error( res.detail ? res.detail : null)
        setInitialValues(initialValues);
      }
    });
  } else {
    setInitialValues(initialValues);
  }
}

export const getActionButtons = (id, hasPerms, setOpen) => {
  let actions = []
  const navigate = useNavigate()
  if (hasPerms.change) {
    actions.push(<GridActionsCellItem icon=<EditIcon/> onClick={() => navigate(`${id}/`)} label="Editar" />)
  }
  if (hasPerms.delete) {
    actions.push(<GridActionsCellItem icon=<DeleteIcon/> onClick={() => setOpen({status: true, id: id})} label="Eliminar" />)
  }
  return actions
}

export const handleFormErrors = (data, setMsg, setErrors ) => {
  let errors = {...data};
  console.error(errors);
  const msg = (errors.non_field_errors || '') + (errors.detail || '')
  if (msg) { setMsg({msg: msg, severity:'error'}); }
  setErrors(errors);
}