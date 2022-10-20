import React from 'react'
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth(props) {
  return props.logged
    ? <Outlet />
    : <Navigate replace to='/' />;
};
