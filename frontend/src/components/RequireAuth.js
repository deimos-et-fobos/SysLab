import React, { useContext } from 'react'
import { Navigate, Outlet } from "react-router-dom";

import { UserContext } from './HomePage'

export default function RequireAuth(props) {
  const { user, setUser } = useContext(UserContext);
  return user
    ? <Outlet />
    : <Navigate replace to='/' />;
};
