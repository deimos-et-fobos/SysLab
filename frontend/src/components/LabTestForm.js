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
import { _hasPerms, getInitialValues } from './utils'

const TYPE = ['Single', 'Compound'];
const SAMPLE_TYPE = ['','Blood','Urine','Vaginal discharge','Semen','Saliva','Stool','Other'];

const API_URL = '/api/lab/lab-tests/';
const LTG_API_URL = '/api/lab/lab-test-groups/';
const REQ_PERMS = {
  add: ['lab.add_labtest','lab.list_labtest','lab.list_labtestgroup'],
  change: ['lab.change_labtest','lab.list_labtest','lab.list_labtestgroup'],
  delete: ['lab.delete_labtest'],
}

const INITIAL_VALUES = {
  code: '',
  name: '',
  ub: '',
  method: '',
  price: '',
  group: undefined,
  sample_type: '',
  type: 'Single',
  childs: [],
  is_antibiogram: false,
  reference_value: '',
  unit: '',
  newchild: '',
}

export default function LabTestForm(props) {
  const [open, setOpen] = useState(false)
  const [initialValues, setInitialValues] = useState(null);
  const [labTests, setLabTests] = useState({id:[], name:[]});
  const [labTestGroups, setLabTestGroups] = useState([]);
  const { msg, setMsg } = useContext(MsgContext);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const hasPerms = _hasPerms(user.permissions, REQ_PERMS);
  const disabled = (id && !hasPerms.change) || (!id && !hasPerms.add)
  
  useEffect(() => {
    fetchServer('GET', API_URL, null, (res, status) => {
      if (status === 200) {
        let _labTests = res.filter( (item) => item.type == TYPE[0] );
        _labTests = Object.assign({}, ..._labTests.map((item) => ({[item.id]: item.code + ' - ' + item.name})));
        setLabTests(_labTests)
      } else {
        res.detail ? setMsg({msg: res.detail , severity:'error'}) : null;
        console.error( res.detail ? res.detail : null)
      }
    });
    fetchServer('GET', LTG_API_URL, null, (res, status) => {
      if (status === 200) {
        setLabTestGroups(res.map( item => item.name));
      } else {
        res.detail ? setMsg({msg: res.detail , severity:'error'}) : null;
        console.error( res.detail ? res.detail : null)
      }
    });
    getInitialValues(API_URL, id, INITIAL_VALUES, setMsg, setInitialValues)
  }, []);

  const schema = Yup.object().shape({
    code: Yup.string().max(30, 'Too long. 30 characters maximum').required('Code is required'),
    name: Yup.string().max(50, 'Too long. 50 characters maximum').required('Name is required'),
    ub:  Yup.string().max(10, 'Too long. 10 characters maximum'),
    method: Yup.string().max(50, 'Too long. 50 characters maximum'),
    price: Yup.string().max(30, 'Too long. 30 characters maximum'),
    group: Yup.string().oneOf([null, ...labTestGroups],'Debe seleccionar una de las opciones de la lista'),
    sample_type: Yup.string(),
    type: Yup.string(),
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
                disabled={disabled}
                required
              />
              <FormInput label='Name'
                className='col-md-3'
                type='text'
                name='name'
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                disabled={disabled}
                required
              />
              <FormInput label='UB'
                className='col-md-3'
                type='text'
                name='ub'
                value={values.ub}
                onChange={handleChange}
                error={errors.ub}
                disabled={disabled}
              />
              <FormInput label='Method'
                className='col-md-3'
                type='text'
                name='method'
                value={values.method}
                onChange={handleChange}
                error={errors.method}
                disabled={disabled}
              />

              <div className='w-100'/>
              <FormInput label='Price'
                className='col-md-3'
                type='text'
                name='price'
                value={values.price}
                onChange={handleChange}
                error={errors.price}
                disabled={disabled}
              />
              <FormDatalist label='Group'
                className='col-md-3'
                type='text'
                name='group'
                value={values.group}
                choices={labTestGroups}
                onChange={handleChange}
                error={errors.group}
                disabled={disabled}
              />
              <FormSelectInput label='Sample Type'
                className='col-md-3'
                name='sample_type'
                value={values.sample_type}
                choices={SAMPLE_TYPE}
                onChange={handleChange}
                error={errors.sample_type}
                disabled={disabled}
              />
              <FormSelectInput label='Type'
                className='col-md-3'
                name='type'
                value={values.type}
                choices={TYPE}
                onChange={handleChange}
                error={errors.type}
                disabled={disabled}
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
                disabled={disabled}
              />
              <FormInput label='Unit'
                className='col-md-3'
                type='text'
                name='unit'
                value={values.unit}
                onChange={handleChange}
                error={errors.unit}
                disabled={disabled}
              />
              <FormCheckBox label='Antibiogram?'
                className='col-md-3'
                type='checkbox'
                name='is_antibiogram'
                value={values.is_antibiogram}
                onChange={handleChange}
                error={errors.is_antibiogram}
                disabled={disabled}
              />

              { (values.type == 'Compound' ) ?
                <FormAddItem label='Sub Tests'
                  className='col-12'
                  type='text'
                  name='newchild'
                  value={values.newchild}
                  childs={values.childs}
                  choices={labTests}
                  handleAddItem={setFieldValue}
                  handleAddItemErrors={setErrors}
                  onChange={handleChange}
                  error={errors.newchild}
                  error_childs={errors.childs}
                  disabled={disabled}
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
