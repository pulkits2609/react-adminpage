import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth.js';

export default function PrivateRoute({ children }) {
  // If user has a token -> allow children, otherwise redirect to login ('/')
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}
