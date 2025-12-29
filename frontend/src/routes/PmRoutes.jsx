import ProtectedRoute from '@/context/ProtectedRoute';
import PmDashboardPage from '@/pages/PM/PmDashboardPage';
import PmDashboardUser from '@/pages/PM/PmDashboardUSer';
import PmLayout from '@/pages/PM/PmLayout';
import PmProjectPage from '@/pages/PM/PmProjectPage';
import PmProjectUser from '@/pages/PM/PmProjectUser';
import PmTaskPage from '@/pages/PM/PmTaskPage';
import PmTaskUser from '@/pages/PM/PmTaskUser';
import PmTimesheetPage from '@/pages/PM/PmTimesheetPage';
import PmTimesheetUser from '@/pages/PM/PmTimesheetUser';
export default {
  path: '/pm',

  element: (
    <ProtectedRoute requiredRole={[1, 2, 3]}>
      <PmLayout />
    </ProtectedRoute>
  ),

  children: [
    {
      path: 'projects',
      element: (
        <ProtectedRoute requiredRole={[1, 2]}>
          <PmProjectPage />
        </ProtectedRoute>
      ),
    },

    {
      path: 'projects-user',
      element: (
        <ProtectedRoute requiredRole={3}>
          <PmProjectUser />
        </ProtectedRoute>
      ),
    },

    {
      path: 'tasks',
      element: (
        <ProtectedRoute requiredRole={[1, 2]}>
          <PmTaskPage />
        </ProtectedRoute>
      ),
    },

    {
      path: 'tasks-user',
      element: (
        <ProtectedRoute requiredRole={3}>
          <PmTaskUser />
        </ProtectedRoute>
      ),
    },

    {
      path: 'dashboard',
      element: (
        <ProtectedRoute requiredRole={[1, 2]}>
          <PmDashboardPage />
        </ProtectedRoute>
      ),
    },

    {
      path: 'dashboard-user',
      element: (
        <ProtectedRoute requiredRole={3}>
          <PmDashboardUser />
        </ProtectedRoute>
      ),
    },
    {
      path: 'timesheet',
      element: (
        <ProtectedRoute requiredRole={[1, 2]}>
          <PmTimesheetPage />
        </ProtectedRoute>
      ),
    },

    {
      path: 'timesheet-user',
      element: (
        <ProtectedRoute requiredRole={3}>
          <PmTimesheetUser />
        </ProtectedRoute>
      ),
    },
  ],
};
