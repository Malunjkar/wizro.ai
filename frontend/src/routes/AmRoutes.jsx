import ProtectedRoute from '@/context/ProtectedRoute';
import AmAdminDashboard from '@/pages/AM/AmAdminDashboard';
import AmAdminLeave from '@/pages/AM/AmAdminLeave';
import AmAttendancePage from '@/pages/AM/AmAttendancePage';
import AmDashboardPage from '@/pages/AM/AmDashboardPage';
import AmLayout from '@/pages/AM/AmLayout';
import AmLeavePage from '@/pages/AM/AmLeavePage';
export default {
  path: '/am',
  element: (
    <ProtectedRoute requiredRole={[1, 2, 3, 4]}>
      <AmLayout />
    </ProtectedRoute>
  ),

  children: [
    {
      path: 'dashboard',
      element: (
        <ProtectedRoute requiredRole={[1, 4,2]}>
          <AmAdminDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: 'dashboard-user',
      element: (
        <ProtectedRoute requiredRole={3}>
          <AmDashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: 'attendance',
      element: (
        <ProtectedRoute requiredRole={[1, 2, 3, 4]}>
          <AmAttendancePage />
        </ProtectedRoute>
      ),
    },
    {
      path: 'myleave',
      element: (
        <ProtectedRoute requiredRole={[1, 4]}>
          <AmAdminLeave />
        </ProtectedRoute>
      ),
    },
    {
      path: 'myleave-user',
      element: (
        <ProtectedRoute requiredRole={[2,3]}>
          <AmLeavePage />
        </ProtectedRoute>
      ),
    },
  ],
};
