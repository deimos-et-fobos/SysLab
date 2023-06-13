import React, { useState, useContext } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';

import { fetchServer } from "./AuthServer";

export const _hasPerms = (perms, req_perms) => {
  let hasPerms = {};
  Object.keys(req_perms).forEach( key => { 
    hasPerms[key] = req_perms[key].every( perm => perms.includes(perm));
  });
  return hasPerms;
}


export const getInitialValues = async(url, id, initialValues, setMsg, setInitialValues) => {
  if (id) {
    fetchServer('GET', url + `${id}/`, null, (res, status) => {
      if (status === 200) {
        Object.keys(res).forEach(
          (key) => { (res[key] === null) ? res[key] = initialValues[key] : null; }
        );
        setInitialValues(res);
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


export const getActionButtons = (id, hasPerms) => {
  let actions = []
  if (hasPerms.change) {
    actions.push(<GridActionsCellItem icon=<EditIcon/> onClick={() => navigate(`${id}/`)} label="Editar" />)
  }
  if (hasPerms.delete) {
    actions.push(<GridActionsCellItem icon=<DeleteIcon/> onClick={() => setOpen({status: true, id: id})} label="Eliminar" />)
  }
  return actions
}