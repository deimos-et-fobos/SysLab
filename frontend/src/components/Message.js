import React, { useState, useEffect, useContext } from 'react';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Snackbar from '@mui/material/Snackbar';

import { MsgContext } from './HomePage';

export default function Message(props) {
  const [alert, setAlert] = useState(true)
  const { msg, setMsg } = useContext(MsgContext);

  useEffect(() => {
    if (!!msg) {
      const timerAlert = setTimeout(() => {
        setAlert(false)
      }, 4000);
      return () => {
        setAlert(true);
        clearTimeout(timerAlert);
      };
    }
  }, [msg]);

  useEffect(() => {
    if (!alert) {
      const timerMsg = setTimeout(() => {
        setMsg(false)
      }, 100);
      return () => {
        clearTimeout(timerMsg);
      };
    }
  }, [alert]);

  return (
    <>
    <Collapse in={!!alert && !!msg}>
      <Alert
        className='mb-3'
        severity={msg.severity}
        onClose={() => setAlert(false)}
        onClick={() => setAlert(false)}
        children={msg.msg}
      />
    </Collapse>
    <Snackbar open={!!msg} autoHideDuration={6000} onClose={()=>{}}>
      <Alert
        className='mb-3'
        severity={msg.severity}
        onClose={() => setAlert(false)}
        onClick={() => setAlert(false)}
        children={msg.msg}
      />
    </Snackbar>
    </>
  )
}
