import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { teal } from '@mui/material/colors';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ConfirmDelete, FormCheckBox, FormInput, FormSelectInput, FormSaveCancelButton } from './FormComponents'
import { MsgContext, PermsContext, UserContext } from './HomePage'
import { fetchServer } from './AuthServer'
import { _hasPerms, getInitialValues } from './utils'
import UserAvatar from './UserAvatar';

const API_URL = '/api/accounts/lab-users/';
const USERTYPES_API_URL = '/api/accounts/lab-user-types/';
const REQ_PERMS = {
  add: ['accounts.add_labmember'],
  change: ['accounts.change_labmember','accounts.list_labusertype'],
  delete: ['accounts.delete_labmember'],
}
const INITIAL_VALUES = {
  user: {
    email: '',
    first_name: '',
    last_name: '',
    profile_pic: '',
    delete_pic: 'false',
    photo_url: '',
  },
  is_active: 'true',
  user_type: '',
}

export default function LabUserForm(props) {
  const [open, setOpen] = useState(false)
  const [userTypes, setUserTypes] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const { msg, setMsg } = useContext(MsgContext);
  const { perms, setPerms } = useContext(PermsContext);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const hasPerms = _hasPerms(perms, REQ_PERMS);
  const disabled = (id && !hasPerms.change) || (!id && !hasPerms.add)

  useEffect(() => {
    fetchServer('GET', USERTYPES_API_URL, null, (res, status) => {
      if (status === 200) {
        setUserTypes(['', ...res].map( item => item.type));
      } else {
        res.detail ? setMsg({msg: res.detail , severity:'error'}) : null;
        console.error( res.detail ? res.detail : null)
      }
    });
    getInitialValues(API_URL, id, INITIAL_VALUES, setMsg, setInitialValues)
    setAvatarPreview(initialValues?.user?.photo_url);
  }, []);

  const schema = Yup.object().shape({
    user: Yup.object().shape({
      email: Yup.string().max(255, 'Too long. 255 characters maximum').email('Invalid email').required('Email is required'),
      first_name: Yup.string().max(150, 'Too long. 150 characters maximum').nullable(),
      last_name: Yup.string().max(150, 'Too long. 150 characters maximum').nullable(),
      profile_pic: Yup.mixed().nullable(),
      delete_pic: Yup.boolean().nullable(),
    }),
    user_type: Yup.string(),
    is_active: Yup.boolean(),
  });

  const handleSubmit = async (values, { setFieldValue, setErrors }) => {
    let errors = {};
    let url = id ? API_URL + `${id}/` : API_URL;
    let method = id ? 'PUT' : 'POST';
    let data = { ...values, multipart: true }
    typeof(data.user.profile_pic) === 'string' ? delete data.user.profile_pic : null;
    fetchServer(method, url, data, (res, status) => {
      if (status === 200 || status === 201) {
        setMsg({msg: `Successfully ${ id ? 'updated' : 'created'}!`, severity: 'success'});
        if (data.user.delete_pic) { 
          setInitialValues({...initialValues, user:{...initialValues.user, photo_url:''}});
          setFieldValue('user.delete_pic', false);
          setAvatarPreview('');
        }
        // This will force to fetch the server from Homepage component
        if ( user.id === initialValues.user.id ) {setUser({...user, values})}
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
        <Typography variant='h4'>{ id ? 'Editar Usuario' : 'Nuevo Usuario'}</Typography>
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            setFieldValue,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form className='mt-3 row' onSubmit={handleSubmit}>
              <FormInput label='Email'
                className='col-md-12'
                type='email'
                name='user.email'
                value={values.user.email}
                onChange={handleChange}
                error={errors.user ? errors.user.email : null}
                disabled={disabled}
                required
              />
              <FormInput label='First name'
                className='col-md-6'
                type='text'
                name='user.first_name'
                value={values.user.first_name}
                onChange={handleChange}
                error={errors.user ? errors.user.first_name : null}
                disabled={disabled}
              />
              <FormInput label='Last name'
                className='col-md-6'
                type='text'
                name='user.last_name'
                value={values.user.last_name}
                onChange={handleChange}
                error={errors.user ? errors.user.last_name : null}
                disabled={disabled}
              />
              <div className='col-md-4 d-flex justify-content-center'>
                <UserAvatar sx={{width: 200, height: 200}} src={avatarPreview || initialValues?.user.photo_url }></UserAvatar>
              </div>
              <div className='col-md-8'>
                <FormInput label='Profile Picture'
                  className='col'
                  type='file'
                  accept='image/*'
                  name='user.profile_pic'
                  onChange={(e) => {
                    let file = e.target.files[0]
                    setAvatarPreview( file ? URL.createObjectURL(file) : initialValues?.user.photo_url );
                    setFieldValue('user.profile_pic',file);
                  }}
                  error={errors.user ? errors.user.profile_pic : null}
                  disabled={disabled}
                />
                <FormCheckBox label='Delete profile picture'
                  className='col'
                  type='checkbox'
                  name='user.delete_pic'
                  value={values.user.delete_pic}
                  onChange={handleChange}
                  error={errors.user ? errors.user.delete_pic : null}
                  disabled={disabled}
                />
                <FormSelectInput label='User Type'
                  className='col'
                  name='user_type'
                  value={values.user_type}
                  choices={userTypes}
                  onChange={handleChange}
                  error={errors.user_type}
                  disabled={disabled}
                />
                <FormCheckBox label='Is active?'
                  className='col'
                  type='checkbox'
                  name='is_active'
                  value={values.is_active}
                  onChange={handleChange}
                  error={errors.is_active}
                  disabled={disabled}
                />
              </div>
              
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
