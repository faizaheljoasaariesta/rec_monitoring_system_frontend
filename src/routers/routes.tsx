import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

// import PrivateRoute from '@/layout/PrivateRoute';
import PublicRoute from '@/layout/PublicRoute';

import Dashboard from '@/pages/Dashboard';
import Product from '@/pages/Product';
import Analytic from '@/pages/Analytic';
import MachineReport from '@/pages/MachineReport';
import ATReport from '@/pages/ATReport';
import DCReport from '@/pages/DCReport';
import AIRReport from '@/pages/AIRreport';

const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <PublicRoute>
        <Dashboard />
      </PublicRoute>
    ),
  },
  {
    path: '/analytic',
    element: (
      <PublicRoute>
        <Analytic />
      </PublicRoute>
    ),
  },
  {
    path: '/machinereport',
    element: (
      <PublicRoute>
        <MachineReport />
      </PublicRoute>
    ),
  },
  {
    path: '/atreport',
    element: (
      <PublicRoute>
        <ATReport />
      </PublicRoute>
    ),
  },
  {
    path: '/dcreport',
    element: (
      <PublicRoute>
        <DCReport />
      </PublicRoute>
    ),
  },
  {
    path: '/airreport',
    element: (
      <PublicRoute>
        <AIRReport />
      </PublicRoute>
    ),
  },
  {
    path: '/product',
    element: (
      <PublicRoute>
        <Product />
      </PublicRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];

export default routes;
