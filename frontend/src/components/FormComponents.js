import React from 'react'
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { orange, grey, indigo, red, teal } from '@mui/material/colors';


export function FormInput(props) {
  return (
    <Box {...props}>
      <Form.Group className='mb-3' controlId={`${props.name}Input`}>
        <Form.Label className='mb-0 mx-1'>{props.label}</Form.Label>
        <Form.Control
          type={props.type}
          name={props.name}
          placeholder={props.label}
          value={props.value}
          onChange={props.onChange}
          isInvalid={!!props.error}
          required={props.required}
        />
        <Form.Control.Feedback className='px-1' type='invalid'>
          {props.error}
        </Form.Control.Feedback>
      </Form.Group>
    </Box>
  )
}

export function FormSelectInput(props) {
  return (
    <Box {...props}>
      <Form.Group className='mb-3' controlId={`${props.name}Input`}>
        <Form.Label className='mb-0 mx-1'>{props.label}</Form.Label>
        <Form.Select
          name={props.name}
          onChange={props.onChange}
          isInvalid={!!props.error}
          required={props.required}
        >
        {/* <option value='' disabled>{props.label}</option> */}
        { props.choices.map( (item, index) => (
          <option key={index} value={item.value}>{item.name}</option>
        ))}
        </Form.Select>
        <Form.Control.Feedback className='px-1' type='invalid'>
          {props.error}
        </Form.Control.Feedback>
      </Form.Group>
    </Box>
  )
}

export function FormSaveCancelButton(props) {
  const { id } = useParams()
  return (
    <Box className='pt-3 container-fluid' >
      <Box className='px-2 row justify-content-end'>
        <Box className='col-6 col-sm-4 col-lg-3 col-xl-2'>
          <Button
            autoFocus
            variant="contained"
            sx={{ width:'100%' }}
            type='submit'
            children='Save'
          />
        </Box>
        { id
          ? <Box className='col-6 col-sm-4 col-lg-3 col-xl-2'>
              <Button
                variant="contained"
                color='danger'
                sx={{ width:'100%' }}
                onClick={props.handleDelete}
                children='Delete'
              />
            </Box>
          : null
        }
        <Box className='col-6 col-sm-4 col-lg-3 col-xl-2'>
          <Button
            variant="contained"
            color='neutral'
            sx={{ width:'100%' }}
            onClick={props.handleCancel}
            children='Cancel'
          />
        </Box>
      </Box>
    </Box>
  )
}

export function ConfirmDelete(props) {
  return (
    <Dialog
        open={props.open}
        onClose={props.handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            color='neutral'
            onClick={props.handleCancel}
            children='Cancel'
          />
          <Button
            variant="contained"
            color='danger'
            onClick={props.handleDelete}
            children='Delete'
          />
        </DialogActions>
      </Dialog>
  )
}

export function FormDatalist(props) {
  return (
    <Box {...props}>
      <Form.Group className='mb-3' controlId={`${props.name}Input`}>
        <Form.Label className='mb-0 mx-1'>{props.label}</Form.Label>
        <Form.Control
          list='data'
          type={props.type}
          name={props.name}
          placeholder={props.label}
          onChange={props.onChange}
          isInvalid={!!props.error}
          required={props.required}
          defaultValue={props.value}
        />
        <datalist id='data'>
          { props.choices.map( (item, index) => (
            <option key={index} value={item}/>
          ))}
        </datalist>
        <Form.Control.Feedback className='px-1' type='invalid'>
          {props.error}
        </Form.Control.Feedback>
      </Form.Group>
    </Box>
  )
}
