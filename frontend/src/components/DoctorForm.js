import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { teal } from '@mui/material/colors';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ConfirmDelete, FormInput, FormSaveCancelButton } from './FormComponents'
import { MsgContext, UserContext } from './HomePage'
import { fetchServer } from './AuthServer'
import { _hasPerms, getInitialValues } from './utils'

const API_URL = '/api/lab/doctors/';
const REQ_PERMS = {
  add: ['lab.add_doctor'],
  change: ['lab.change_doctor'],
  delete: ['lab.delete_doctor'],
}
const INITIAL_VALUES = {
  first_name: '',
  last_name: '',
  medical_license: '',
  speciality: '',
}

export default function PatientForm(props) {
  const [open, setOpen] = useState(false)
  const [initialValues, setInitialValues] = useState(null);
  const { msg, setMsg } = useContext(MsgContext);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const hasPerms = _hasPerms(user.permissions, REQ_PERMS);
  const disabled = (id && !hasPerms.change) || (!id && !hasPerms.add)

  useEffect(() => {
    getInitialValues(API_URL, id, INITIAL_VALUES, setMsg, setInitialValues)
  }, []);

  const schema = Yup.object().shape({
    first_name: Yup.string().max(120, 'Too long. 120 characters maximum').required('First name is required'),
    last_name: Yup.string().max(120, 'Too long. 120 characters maximum').required('Last name is required'),
    medical_license: Yup.string().max(10, 'Too long. 10 characters maximum').required('License is required'),
    specialty: Yup.string().max(30, 'Too long. 30 characters maximum'),
    });

  const handleSubmit = async (values, { setErrors }) => {
    let errors = {};
    let url = id ? API_URL + `${id}/` : API_URL;
    let method = id ? 'PUT' : 'POST';
    fetchServer(method, url, values, (res, status) => {
      if (status === 200 || status === 201) {
        setMsg({msg: `Successfully ${ id ? 'updated' : 'created'}!`, severity: 'success'});
        method === 'POST' ? navigate('../') : null;
      } else {
        errors = {...res}
        console.error(errors);
        setMsg({msg: errors.non_field_errors || '' + errors.detail || '', severity:'error'});
        setErrors(errors)
      }
    })
  }

  const handleDelete = async () => {
    fetchServer('DELETE', API_URL + `${id}/`, null, (res, status) => {
      if (status === 204) {
        setMsg({msg:'Successfully deleted!', severity:'success'});
        navigate('../');
      } else {
        setMsg({msg: `Could not delete! ${res.detail}`, severity:'error'});
        console.error(`Could not delete! ${res.detail}`);
      }
    });
    setOpen(false);
  }

  if (!initialValues) {
    return <p>Loading...</p>
  }
  return (
    <Box>
      <Paper variant="outlined" sx={{ borderColor: teal['700'], p:5}}>
        <Typography variant='h4'>{ id ? 'Editar Doctor' : 'Nuevo Doctor'}</Typography>
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form className='mt-3 row' onSubmit={handleSubmit}>
              <FormInput label='First name'
                className='col-md-6'
                type='text'
                name='first_name'
                value={values.first_name}
                onChange={handleChange}
                error={errors.first_name}
                disabled={disabled}
                required
              />
              <FormInput label='Last name'
                className='col-md-6'
                type='text'
                name='last_name'
                value={values.last_name}
                onChange={handleChange}
                error={errors.last_name}
                disabled={disabled}
                required
              />
              <FormInput label='License'
                className='col-md-6'
                type='text'
                name='medical_license'
                value={values.medical_license}
                onChange={handleChange}
                error={errors.medical_license}
                disabled={disabled}
                required
              />
              <FormInput label='Specialty'
                className='col-md-6'
                type='text'
                name='specialty'
                value={values.specialty}
                onChange={handleChange}
                error={errors.specialty}
                disabled={disabled}
              />
              <FormSaveCancelButton
                hasPerms={hasPerms}
                handleDelete={() => setOpen(true)}
                handleCancel={() => navigate('../')}
              />
              <ConfirmDelete
                open={open}
                handleDelete={handleDelete}
                handleCancel={() => setOpen(false)}
              />
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  )
}
