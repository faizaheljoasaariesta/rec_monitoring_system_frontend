import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

// import PrivateRoute from '@/layout/PrivateRoute';
import PublicRoute from '@/layout/PublicRoute';

import Dashboard from '@/pages/Dasboard';

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
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];

export default routes;
