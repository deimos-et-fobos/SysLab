import React, { useState, useContext } from 'react'

import AddButton from "./AddButton";
import DataTable from "./DataTable";
import { ConfirmDelete } from './FormComponents'
import { MsgContext } from './HomePage'

import { fetchServer } from './AuthServer'

export default function ListComponent(props) {
  const [rows, setRows] = useState(null);
  const { msg, setMsg } = useContext(MsgContext);

  const handleDelete = async () => {
    const id = props.open.id;
    let url = props.api_url + `${id}/`
    fetchServer('DELETE', url, null, (res, status) => {
      if (status === 204) {
        setRows(rows.filter(row => row.id !== id));
        setMsg({msg:'Successfully deleted!', severity:'success'});
      } else {
        setMsg({msg: `Could not delete! ${res.detail}`, severity:'error'});
        console.error(`Could not delete! ${res.detail}`);
      }
    });
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
        // addButton={props.addPerm ? <AddButton icon={props.icon} /> : null}
        addButton={props.addButton}
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
