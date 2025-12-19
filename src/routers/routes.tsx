import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import PrivateRoute from '@/layout/private-route';
import PublicRoute from '@/layout/public-route';

import Dashboard from '@/pages/dashboard-page';
import Product from '@/pages/product-page';
import Analytic from '@/pages/analytic-report-page';
import MachineReport from '@/pages/machine-report-page';
import ATReport from '@/pages/at-report-page';
import DCReport from '@/pages/dc-report-page';
import AIRReport from '@/pages/air-report-page';
import ASReport from '@/pages/as-report-page';
import LoginPage from '@/pages/login-page';
import Users from '@/pages/users-setting-page';

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
    path: '/users',
    element: (
      <PrivateRoute>
        <Users />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];

export default routes;
