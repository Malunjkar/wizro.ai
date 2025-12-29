import { Loader2 } from 'lucide-react';
import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredPermission, requiredRole }) => {
  const { user, loading, isAuthenticated, hasPermission } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ROLE CHECK  //
  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!allowed.includes(user.role)) {
      //  UNIVERSAL AUTO-REDIRECT FOR ALL MODULES (pm, am, hr, tm, um)
      if (user.role === 3||user.role===2) {
        // only employee gets redirected
        const path = location.pathname;

        const parts = path.split('/').filter(Boolean);

        if (parts.length >= 2) {
          const module = parts[0];

          const page = parts[1];

          const redirectTo = `/${module}/${page}-user`;

          return <Navigate to={redirectTo} replace />;
        }
      }

      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Access Denied</h3>
            <p className="text-gray-500">You don't have permission.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
              Go Home
            </button>
          </div>
        </div>
      );
    }
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Insufficient Permissions</div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
