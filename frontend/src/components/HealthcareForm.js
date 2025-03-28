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
import { _hasPerms, getInitialValues, handleFormErrors } from './utils';

const API_URL = '/api/lab/healthcare/';
const INITIAL_VALUES = {
  name: '',
}

export default function PatientForm({ hasPerms }) {
  const [open, setOpen] = useState(false)
  const [initialValues, setInitialValues] = useState(null);
  const { msg, setMsg } = useContext(MsgContext);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const noEditable = (id && !hasPerms.change) || (!id && !hasPerms.add)

  useEffect(() => {
    getInitialValues(API_URL, id, INITIAL_VALUES, setMsg, setInitialValues)
  }, []);

  const schema = Yup.object().shape({
    name: Yup.string().max(120, 'Too long. 120 characters maximum').required('Name is required'),
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
        <Typography variant='h4'>{ id ? 'Editar Obra Social' : 'Nueva Obra Social'}</Typography>
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
              <FormInput label='Name'
                className='col-md-6'
                type='text'
                name='name'
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                disabled={noEditable}
                required
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
