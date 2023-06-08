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
import { MsgContext } from './HomePage'
import { fetchServer } from './AuthServer'
import { _hasPerms, getInitialValues } from './utils'


const ID_TYPE = [
  { value: '0', name: 'DNI' },
  { value: '1', name: 'LE' },
  { value: '2', name: 'LC' },
  { value: '3', name: 'Passport' },
  { value: '4', name: 'Other' },
]
const GENDER = [
  { value: '', name: 'Gender' },
  { value: '0', name: 'Male' },
  { value: '1', name: 'Female' },
  { value: '2', name: 'Non-Binary' },
  { value: '3', name: 'Other' },
]
// const HC_PROV = ['OSDE','PAMI','UMSE','SANCOR','OSPE']
const API_URL = '/api/lab/patients/';
const HCP_API_URL = '/api/lab/healthcare/';

const INITIAL_VALUES = {
  first_name: '',
  last_name: '',
  id_type: '0',
  id_number: '',
  birthday: undefined,
  age: undefined,
  gender: undefined,
  healthcare_provider: '',
  phone: '',
  address: '',
  email: '',
}

// const getListPage = () => {
//   let a = window.location.pathname.split('/');
//   a.splice(-2,1);
//   return a.join('/');
// }

export default function PatientForm(props) {
  const [open, setOpen] = useState(false)
  const [healthcareProvider, setHealthcareProvider] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const { msg, setMsg } = useContext(MsgContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchServer('GET', HCP_API_URL, null, (res, status) => {
      if (status === 200) {
        setHealthcareProvider(res.map( item => item.name));
      } else {
        res.detail ? setMsg({msg: res.detail , severity:'error'}) : null;
        console.error( res.detail ? res.detail : null)
      }
    });
    getInitialValues(API_URL, id, INITIAL_VALUES, setMsg, setInitialValues)
  }, []);

  const schema = Yup.object().shape({
    first_name: Yup.string().max(120, 'Too long. 120 characters maximum').required('First name is required'),
    last_name: Yup.string().max(120, 'Too long. 120 characters maximum').required('Last name is required'),
    id_type: Yup.string().required('ID type is required'),
    id_number: Yup.string().max(30, 'Too long. 30 characters maximum').required('ID number is required'),
    birthday: Yup.date(),
    age: Yup.number().min(0, 'Age must be >= 0').integer(),
    gender: Yup.string(),
    healthcare_provider: Yup.string().oneOf([null, ...healthcareProvider],'Debe seleccionar una de las opciones de la lista'),
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
        for (let field in res){
          errors[field] = res[field][0];
        }
        console.error(errors);
        errors.non_field_errors ? setMsg({msg: errors.non_field_errors , severity:'error'}) : null;
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
        setOpen(false);
      }
    });
  }

  if (!initialValues) {
    return <p>Loading...</p>
  }
  return (
    <Box>
      <Paper variant="outlined" sx={{ borderColor: teal['700'], p:5}}>
        <Typography variant='h4'>{ id ? 'Edit Patient' : 'Create New Patient'}</Typography>
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
                required
              />
              <FormInput label='Last name'
                className='col-md-6'
                type='text'
                name='last_name'
                value={values.last_name}
                onChange={handleChange}
                error={errors.last_name}
                required
              />
              <FormSelectInput label='ID Type'
                className='col-md-4'
                name='id_type'
                value={values.id_type}
                choices={ID_TYPE}
                onChange={handleChange}
                error={errors.id_type}
                required
              />
              <FormInput label='ID Number'
                className='col-md-4'
                type='text'
                name='id_number'
                value={values.id_number}
                onChange={handleChange}
                error={errors.id_number}
                required
              />
              <FormSelectInput label='Gender'
                className='col-md-4'
                name='gender'
                value={values.gender}
                choices={GENDER}
                onChange={handleChange}
                error={errors.gender}
              />
              <div className='w-100'/>
              <FormInput label='Birthday'
                className='col-md-4'
                type='date'
                name='birthday'
                value={values.birthday}
                onChange={handleChange}
                error={errors.birthday}
              />
              <FormInput label='Age'
                className='col-md-4'
                type='number'
                name='age'
                value={values.age}
                onChange={handleChange}
                error={errors.age}
              />
              <FormDatalist label='Healthcare Provider'
                className='col-md-6'
                type='text'
                name='healthcare_provider'
                value={values.healthcare_provider}
                choices={healthcareProvider}
                onChange={handleChange}
                error={errors.healthcare_provider}
              />
              <FormInput label='Address'
                className='col-md-6'
                type='text'
                name='address'
                value={values.address}
                onChange={handleChange}
                error={errors.address}
              />
              <FormInput label='Phone number'
                className='col-md-6'
                type='text'
                name='phone'
                value={values.phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <FormInput label='Email'
                className='col-md-6'
                type='email'
                name='email'
                value={values.email}
                onChange={handleChange}
                error={errors.email}
              />
              <FormSaveCancelButton
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
