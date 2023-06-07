import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Form from 'react-bootstrap/Form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { login } from './AuthServer'
import { FormInput } from './FormComponents'
import { LabContext, MsgContext, UserContext } from './HomePage'
import Message from './Message'

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginPage(props) {
  const { msg, setMsg } = useContext(MsgContext);
  const { user, setUser } = useContext(UserContext);
  const { laboratory, setLaboratory } = useContext(LabContext);
  const navigate = useNavigate();
  const nextPage = useLocation().pathname
  let { labName } = useParams()

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    let errors = {};
    // let res = { user: user, laboratory: laboratory }
    let data = { 
      email: values.email, 
      password: values.password,
    }
    login('POST', data, labName, (res, status) => {
      if (status === 200) {
        setUser(res.user);
        setLaboratory(res.laboratory);
        res.user ? navigate(0) : null;
      } else {
        for (let field in res){
          errors[field] = res[field][0];
        }
        console.error(errors);
        errors.non_field_errors ? setMsg({msg: errors.non_field_errors , severity:'error'}) : null;
        setErrors(errors)
      }
    })
    setSubmitting(false);
  }

  return (
    <Container sx={{py:5}}>
      <Typography variant='h4'>{ laboratory ? laboratory.name : 'SysLab' } Login Page</Typography>
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={{
          email: 'richi@gmail.com',
          password: '',
        }}
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
            <Message />
            <FormInput label='Email'
              className='col-12'
              type='text'
              name='email'
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <FormInput label='Password'
              className='col-12'
              type='password'
              name='password'
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <Box className='pt-3 container-fluid' >
              <Box className='px-2 row justify-content-end'>
                <Box className='col-6 col-sm-4 col-lg-3 col-xl-2'>
                  <Button
                    variant="contained"
                    color='primary'
                    sx={{ width:'100%' }}
                    type='submit'
                    children='Login'
                  />
                </Box>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
