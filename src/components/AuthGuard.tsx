
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show nothing while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-stream-dark text-white flex items-center justify-center">
        <div className="animate-pulse text-neon-cyan">Loading...</div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If logged in, render children
  return <>{children}</>;
}
