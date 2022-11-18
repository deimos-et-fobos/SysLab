import React, { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

import AddButton from "./AddButton";
import DataTable from "./DataTable";
import { ConfirmDelete } from './FormComponents'
import { MsgContext } from './HomePage'

import { fetchServer } from './AuthServer'

export default function ListComponent(props) {
  const [rows, setRows] = useState(null);
  const { msg, setMsg } = useContext(MsgContext);
  const navigate = useNavigate()
  const pathname = useLocation().pathname

  const handleDelete = async () => {
    const id = props.open.id;
    try {
      const data = await fetchServer(props.api_url + `${id}/`, {action: 'destroy'});
      setRows(rows.filter(row => row.id !== id));
      setMsg({msg:'Successfully deleted!', severity:'success'});
    } catch (err) {
      setMsg({msg:'Could not delete!', severity:'error'});
      console.error(err);
      console.error(err.detail);
    }
    props.setOpen({status: false});
  }

  return (
    <div>
      <DataTable
        columns={props.columns}
        rows={rows}
        setRows={setRows}
        api_url={props.api_url}
        title={props.title}
        titleProps={{ p: 2 }}
        addButton={<AddButton icon={props.icon} />}
        sx={{
          boxShadow: 2,
          bgcolor: 'white',
          borderColor:  'secondary.dark',
        }}
      />
      <ConfirmDelete
        open={props.open.status}
        handleDelete={handleDelete}
        handleCancel={() => props.setOpen({status:false})}
      />
    </div>
  )
};
