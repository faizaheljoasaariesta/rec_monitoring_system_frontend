import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuth } from '@/hooks/use-auth';

interface Props {
  children: ReactNode;
}

const PublicRoute = ({ children }: Props) => {
  const { auth, loading } = useIsAuth();

  if (loading) {
    return (
      <div className="flex h-screen">
        <main className="grow overflow-hidden" />
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
