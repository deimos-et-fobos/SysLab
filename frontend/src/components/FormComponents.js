import React from 'react'
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Form from 'react-bootstrap/Form';


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
          disabled={props.disabled}
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
          value={props.value}
          onChange={props.onChange}
          isInvalid={!!props.error}
          required={props.required}
          disabled={props.disabled}
        >
        {/* <option value='' disabled>{props.label}</option> */}
        { props.choices.map( (item, index) => (
          <option key={index}>{item}</option>
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
      <Box className='px-2 row justify-content-end pb-2'>
        { true
          ? <Box className='col col-sm-4 col-lg-3 col-xl-2 mb-2'>
              <Button
                variant="contained"
                sx={{ width:'100%' }}
                type='submit'
                disabled={(id && !props.hasPerms.change) || (!id && !props.hasPerms.add)}
                children={ id ? 'Guardar' : 'Crear' }
              />
            </Box>
          : null  
        }
        { id 
          ? <Box className='col col-sm-4 col-lg-3 col-xl-2 mb-2'>
              <Button
                variant="contained"
                color='danger'
                sx={{ width:'100%' }}
                onClick={props.handleDelete}
                disabled={!props.hasPerms.delete}
                children='Eliminar'
              />
            </Box>
          : null
        }
        <Box className='col col-sm-4 col-lg-3 col-xl-2 mb-2'>
          <Button
            variant="contained"
            color='neutral'
            sx={{ width:'100%' }}
            onClick={props.handleCancel}
            children='Atrás'
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
          {"Confirmar eliminación"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro que desea continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            color='neutral'
            onClick={props.handleCancel}
            children='Cancelar'
          />
          <Button
            variant="contained"
            color='danger'
            onClick={props.handleDelete}
            children='Eliminar'
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
          disabled={props.disabled}
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
