import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import PrivateRoute from '@/layout/PrivateRoute';
import PublicRoute from '@/layout/PublicRoute';

import Dashboard from '@/pages/Dashboard';
import Product from '@/pages/Product';
import Analytic from '@/pages/Analytic';
import MachineReport from '@/pages/MachineReport';
import ATReport from '@/pages/ATReport';
import DCReport from '@/pages/DCReport';
import AIRReport from '@/pages/AIRreport';
import ASReport from '@/pages/ASReport';
import LoginPage from '@/pages/Login';

const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/analytic',
    element: (
      <PrivateRoute>
        <Analytic />
      </PrivateRoute>
    ),
  },
  {
    path: '/machinereport',
    element: (
      <PrivateRoute>
        <MachineReport />
      </PrivateRoute>
    ),
  },
  {
    path: '/atreport',
    element: (
      <PrivateRoute>
        <ATReport />
      </PrivateRoute>
    ),
  },
  {
    path: '/dcreport',
    element: (
      <PrivateRoute>
        <DCReport />
      </PrivateRoute>
    ),
  },
  {
    path: '/airreport',
    element: (
      <PrivateRoute>
        <AIRReport />
      </PrivateRoute>
    ),
  },
  {
    path: '/asreport',
    element: (
      <PrivateRoute>
        <ASReport />
      </PrivateRoute>
    ),
  },
  {
    path: '/product',
    element: (
      <PrivateRoute>
        <Product />
      </PrivateRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];

export default routes;
