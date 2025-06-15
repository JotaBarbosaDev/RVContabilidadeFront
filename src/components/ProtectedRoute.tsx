import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isTokenValid, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accounting-primary"></div>
      </div>
    );
  }

  // Se a rota requer autenticação
  if (requireAuth) {
    // Se não está autenticado ou token inválido, redirecionar para login
    if (!isAuthenticated || !isTokenValid()) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } else {
    // Se é uma rota pública (como login) mas o usuário já está autenticado
    // com token válido, redirecionar para dashboard
    if (isAuthenticated && isTokenValid()) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
