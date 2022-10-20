import React from 'react'
import { Navigate, Outlet, useLocation } from "react-router-dom";

import LoginPage from './LoginPage'

export default function RequireAuth(props) {
  let nextPage = useLocation().pathname
  return props.logged
    ? <Outlet />
    : <Navigate replace to="login/" state={{nextPage:nextPage}} />;
};
