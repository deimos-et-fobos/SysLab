import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { teal } from '@mui/material/colors';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ConfirmDelete, FormDatalist, FormInput, FormSelectInput, FormSaveCancelButton } from './FormComponents'
import { MsgContext, UserContext } from './HomePage'
import { fetchServer } from './AuthServer'
import { _hasPerms, getInitialValues, handleFormErrors } from './utils'

const API_URL = '/api/lab/patients/';
const INITIAL_VALUES = {
  first_name: '',
  last_name: '',
  id_type: '',
  id_type_choices: [],
  id_number: '',
  birthday: undefined,
  age: undefined,
  gender: '',
  gender_choices: [],
  healthcare_provider: '',
  healthcare_provider_choices: [],  
  phone: '',
  address: '',
  email: '',
}

export default function PatientForm({ hasPerms }) {
  const [open, setOpen] = useState(false)
  const [initialValues, setInitialValues] = useState(null);
  const { msg, setMsg } = useContext(MsgContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const noEditable = (id && !hasPerms.change) || (!id && !hasPerms.add)

  useEffect(() => {
    getInitialValues(API_URL, id, INITIAL_VALUES, setMsg, setInitialValues, {choice: true})
  }, []);

  const schema = Yup.object().shape({
    first_name: Yup.string().max(120, 'Too long. 120 characters maximum').required('First name is required'),
    last_name: Yup.string().max(120, 'Too long. 120 characters maximum').required('Last name is required'),
    id_type: Yup.string(),
    id_number: Yup.string().max(30, 'Too long. 30 characters maximum').required('ID number is required'),
    birthday: Yup.date(),
    age: Yup.number().min(0, 'Age must be >= 0').integer(),
    gender: Yup.string(),
    healthcare_provider: Yup.string().oneOf(initialValues?.healthcare_provider_choices ?? [],'Debe seleccionar una de las opciones de la lista'),
    phone: Yup.string().max(30, 'Too long. 30 characters maximum'),
    address: Yup.string().max(150, 'Too long. 150 characters maximum'),
    email: Yup.string().max(150, 'Too long. 150 characters maximum').email('Invalid email'),
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
        handleFormErrors(res, setErrors, setMsg)
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
        <Typography variant='h4'>{ id ? 'Editar Paciente' : 'Nuevo Paciente'}</Typography>
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
                disabled={noEditable}
                required
              />
              <FormInput label='Last name'
                className='col-md-6'
                type='text'
                name='last_name'
                value={values.last_name}
                onChange={handleChange}
                error={errors.last_name}
                disabled={noEditable}
                required
              />
              <FormSelectInput label='ID Type'
                className='col-md-4'
                name='id_type'
                value={values.id_type}
                choices={initialValues.id_type_choices}
                onChange={handleChange}
                error={errors.id_type}
                disabled={noEditable}
              />
              <FormInput label='ID Number'
                className='col-md-4'
                type='text'
                name='id_number'
                value={values.id_number}
                onChange={handleChange}
                error={errors.id_number}
                disabled={noEditable}
                required
              />
              <FormSelectInput label='Gender'
                className='col-md-4'
                name='gender'
                value={values.gender}
                choices={initialValues.gender_choices}
                onChange={handleChange}
                error={errors.gender}
                disabled={noEditable}
              />
              <div className='w-100'/>
              <FormInput label='Birthday'
                className='col-md-4'
                type='date'
                name='birthday'
                value={values.birthday}
                onChange={handleChange}
                error={errors.birthday}
                disabled={noEditable}
              />
              <FormInput label='Age'
                className='col-md-4'
                type='number'
                name='age'
                value={values.age}
                onChange={handleChange}
                error={errors.age}
                disabled={noEditable}
              />
              <FormDatalist label='Healthcare Provider'
                className='col-md-6'
                type='text'
                name='healthcare_provider'
                value={values.healthcare_provider}
                choices={initialValues.healthcare_provider_choices}
                onChange={handleChange}
                error={errors.healthcare_provider}
                disabled={noEditable}
              />
              <FormInput label='Address'
                className='col-md-6'
                type='text'
                name='address'
                value={values.address}
                onChange={handleChange}
                error={errors.address}
                disabled={noEditable}
              />
              <FormInput label='Phone number'
                className='col-md-6'
                type='text'
                name='phone'
                value={values.phone}
                onChange={handleChange}
                error={errors.phone}
                disabled={noEditable}
              />
              <FormInput label='Email'
                className='col-md-6'
                type='email'
                name='email'
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                disabled={noEditable}
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
