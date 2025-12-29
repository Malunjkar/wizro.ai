import ProtectedRoute from '@/context/ProtectedRoute';
import HrLayout from '@/pages/HR/HrLayout';

import HrDashboardPage from '@/pages/HR/HrDashboardPage';
import HrDashboardUser from '@/pages/HR/HrDashboardUser';

import HrEmpPage from '@/pages/HR/HrEmpPage';
import HrEmpUser from '@/pages/HR/HrEmpUser';

import HrPayrollPage from '@/pages/HR/HrPayrollPage';
import HrPayrollUser from '@/pages/HR/HrPayrollUser';

import HrPerformancePage from '@/pages/HR/HrPerformancePage';
import HrPerformanceUser from '@/pages/HR/HrPerformanceUser';

export default {
  path: '/hr',

  element: (
    <ProtectedRoute requiredRole={[1, 2, 3,4]}>
      <HrLayout />
    </ProtectedRoute>
  ),

  children: [
    // DASHBOARD
    {
      path: 'dashboard',
      element: (
        <ProtectedRoute requiredRole={[1,4]}>
          <HrDashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: 'dashboard-user',
      element: (
        <ProtectedRoute requiredRole={[2, 3]}>
          <HrDashboardUser />
        </ProtectedRoute>
      ),
    },

    // EMPLOYEES
    {
      path: 'employees',
      element: (
        <ProtectedRoute requiredRole={[1,4]}>
          <HrEmpPage />
        </ProtectedRoute>
      ),
    },
    {
      path: 'employees-user',
      element: (
        <ProtectedRoute requiredRole={[2, 3]}>
          <HrEmpUser />
        </ProtectedRoute>
      ),
    },

    // PAYROLL
    {
      path: 'payroll',
      element: (
        <ProtectedRoute requiredRole={[1,4]}>
          <HrPayrollPage />
        </ProtectedRoute>
      ),
    },
    {
      path: 'payroll-user',
      element: (
        <ProtectedRoute requiredRole={[2, 3]}>
          <HrPayrollUser />
        </ProtectedRoute>
      ),
    },

    // PERFORMANCE
    {
      path: 'performance',
      element: (
        <ProtectedRoute requiredRole={[1,4]}>
          <HrPerformancePage />
        </ProtectedRoute>
      ),
    },
    {
      path: 'performance-user',
      element: (
        <ProtectedRoute requiredRole={[2, 3]}>
          <HrPerformanceUser />
        </ProtectedRoute>
      ),
    },
  ],
};
