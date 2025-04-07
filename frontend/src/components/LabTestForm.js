import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { teal } from '@mui/material/colors';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ConfirmDelete, FormAddItem, FormCheckBox, FormDatalist, FormInput, FormSelectInput, FormSaveCancelButton } from './FormComponents'
import { MsgContext, UserContext } from './HomePage'
import { fetchServer } from './AuthServer'
import { _hasPerms, getInitialValues, handleFormErrors } from './utils'

const API_URL = '/api/lab/lab-tests/';

const INITIAL_VALUES = {
  code: '',
  name: '',
  ub: '',
  method: '',
  price: '',
  group: undefined,
  group_choices: [],
  sample_type: '',
  sample_type_choices: [],
  type: 'Single', // puede ir undefined tmb
  type_choices: [],
  childs: [],
  is_antibiogram: false,
  reference_value: '',
  unit: '',
  newchild: '',
}

export default function LabTestForm({ hasPerms }) {
  const [open, setOpen] = useState(false)
  const [initialValues, setInitialValues] = useState(null);
  const [labTests, setLabTests] = useState({id:[], name:[]});
  const [labTestGroups, setLabTestGroups] = useState([]);
  const { msg, setMsg } = useContext(MsgContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const noEditable = (id && !hasPerms.change) || (!id && !hasPerms.add)
  
  useEffect(() => {
    fetchServer('GET', API_URL, null, (res, status) => {
      console.log(res, status);
      
      if (status === 200) {
        let _labTests = res.filter( (item) => item.type == 'Single' );
        _labTests = Object.assign({}, ..._labTests.map((item) => ({[item.id]: item.code + ' - ' + item.name})));
        setLabTests(_labTests)
      } else {
        handleFormErrors(res, setErrors, setMsg)
      }
    });
    getInitialValues(API_URL, id, INITIAL_VALUES, setMsg, setInitialValues, {choices:true})
  }, []);

  const schema = Yup.object().shape({
    code: Yup.string().max(30, 'Too long. 30 characters maximum').required('Code is required'),
    name: Yup.string().max(50, 'Too long. 50 characters maximum').required('Name is required'),
    ub:  Yup.string().max(10, 'Too long. 10 characters maximum'),
    method: Yup.string().max(50, 'Too long. 50 characters maximum'),
    price: Yup.string().max(30, 'Too long. 30 characters maximum'),
    group: Yup.string().oneOf(initialValues?.group_choices ?? [],'Debe seleccionar una de las opciones de la lista'),
    sample_type: Yup.string(),
    type: Yup.string().nullable(),
    childs: Yup.array(),
    newchild: Yup.string().oneOf(['', ...Object.values(labTests)],'Debe seleccionar una de las opciones de la lista'),
    // childs: Yup.string().max(150, 'Too long. 150 characters maximum'),
    is_antibiogram: Yup.boolean(),
    reference_value: Yup.string().max(255, 'Too long. 255 characters maximum'),
    unit: Yup.string().max(50, 'Too long. 50 characters maximum'),
  });

  const handleSubmit = async (values, { setErrors }) => {
    let errors = {};
    let url = id ? API_URL + `${id}/` : API_URL;
    let method = id ? 'PUT' : 'POST';
    console.log(values);
    
    fetchServer(method, url, values, (res, status) => {
      if (status === 200 || status === 201) {
        setMsg({msg: `Successfully ${ id ? 'updated' : 'created'}!`, severity: 'success'});
        method === 'POST' ? navigate('../') : null;
      } else {
        handleFormErrors(res, setMsg, setErrors)
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
        <Typography variant='h4'>{ id ? 'Editar Test' : 'Nuevo Test'}</Typography>
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        >
          {({
            handleSubmit,
            handleChange,
            setFieldValue,
            setErrors,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form className='mt-3 row' onSubmit={handleSubmit}>
              <FormInput label='Code'
                className='col-md-3'
                type='text'
                name='code'
                value={values.code}
                onChange={handleChange}
                error={errors.code}
                disabled={noEditable}
                required
              />
              <FormInput label='Name'
                className='col-md-3'
                type='text'
                name='name'
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                disabled={noEditable}
                required
              />
              <FormInput label='UB'
                className='col-md-3'
                type='text'
                name='ub'
                value={values.ub}
                onChange={handleChange}
                error={errors.ub}
                disabled={noEditable}
              />
              <FormInput label='Method'
                className='col-md-3'
                type='text'
                name='method'
                value={values.method}
                onChange={handleChange}
                error={errors.method}
                disabled={noEditable}
              />

              <div className='w-100'/>
              <FormInput label='Price'
                className='col-md-3'
                type='text'
                name='price'
                value={values.price}
                onChange={handleChange}
                error={errors.price}
                disabled={noEditable}
              />
              <FormDatalist label='Group'
                className='col-md-3'
                type='text'
                name='group'
                value={values.group}
                choices={initialValues.group_choices}
                onChange={handleChange}
                error={errors.group}
                disabled={noEditable}
              />
              <FormSelectInput label='Sample Type'
                className='col-md-3'
                name='sample_type'
                value={values.sample_type}
                choices={initialValues.sample_type_choices}
                onChange={handleChange}
                error={errors.sample_type}
                disabled={noEditable}
              />
              <FormSelectInput label='Type'
                className='col-md-3'
                name='type'
                value={values.type}
                choices={initialValues.type_choices}
                onChange={handleChange}
                error={errors.type}
                disabled={noEditable}
                required
              />

              <div className='w-100'/>
              <FormInput label='Reference Value'
                className='col-md-3'
                type='text'
                name='reference_value'
                value={values.reference_value}
                onChange={handleChange}
                error={errors.reference_value}
                disabled={noEditable}
              />
              <FormInput label='Unit'
                className='col-md-3'
                type='text'
                name='unit'
                value={values.unit}
                onChange={handleChange}
                error={errors.unit}
                disabled={noEditable}
              />
              <FormCheckBox label='Antibiogram?'
                className='col-md-3'
                type='checkbox'
                name='is_antibiogram'
                value={values.is_antibiogram}
                onChange={handleChange}
                error={errors.is_antibiogram}
                disabled={noEditable}
              />

              { (values.type == 'Compound' ) ?
                <FormAddItem label='Sub Tests'
                  className='col-12'
                  type='text'
                  name='newchild'
                  value={values.newchild}
                  childs={values.childs}
                  choices={labTests}
                  handleadditem={setFieldValue}
                  handleadditemerrors={setErrors}
                  onChange={handleChange}
                  error={errors.newchild}
                  error_childs={errors.childs}
                  disabled={noEditable}
                />
                : null
              }
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
