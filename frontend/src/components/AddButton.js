import React from 'react'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function AddButton(props) {
  const navigate = useNavigate()
  const handleOnClick = () => {
    navigate('new/');
  }
  return (
    <Button
      color='primary'
      variant="contained"
      size='small'
      onClick={handleOnClick}
    >
      <Typography sx={{ fontStyle:'strong' }}>
        +
      </Typography>
      {props.icon}
    </Button>
  )
}
