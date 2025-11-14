import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

// import PrivateRoute from '@/layout/PrivateRoute';
import PublicRoute from '@/layout/PublicRoute';

import Dashboard from '@/pages/Dasboard';
// import Product from '@/pages/Product';
import Testing from '@/pages/Testing';

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
    path: '/product',
    element: (
      <PublicRoute>
        <Testing />
      </PublicRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];

export default routes;
