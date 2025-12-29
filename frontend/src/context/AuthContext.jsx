import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

import axiosInstance, { setAccessToken } from '@/lib/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // AUTO LOGIN ON PAGE REFRESH (using refresh cookie)
  const tryAutoLogin = async () => {
    try {
      const res = await axiosInstance.post('/user/refresh'); // cookie sent automatically

      setAccessToken(res.data.accessToken);

      setUser({
        email: res.data.email,
        empID: res.data.empID,
        fullName: res.data.fullName,
        role: res.data.role,
      });

      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tryAutoLogin();
  }, []);

  const login = async (data) => {
    setLoading(true);

    try {
      const res = await axiosInstance.post('/user/login', data, {
        withCredentials: true,
      });

      // The backend returns a short-lived access token
      setAccessToken(res.data.accessToken);

      // Store user in memory only (secure)
      setUser({
        email: res.data.email,
        empID: res.data.empID,
        fullName: res.data.fullName,
        role: res.data.role,
      });

      setIsAuthenticated(true);

      toast.success(`Welcome back, ${res.data.fullName}!`);

      return 200;
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(error.response.data?.Mess);
      } else {
        toast.error('Something went wrong!');
      }

      return 400;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post('/user/register', data, { withCredentials: true });
      toast.success(`Welcome, continue by logging in, ${data.fullName}!`);

      return 200;
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(error.response.data?.mess);
      } else {
        toast.error('Something went wrong!');
      }

      return 400;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/user/logout', {}, { withCredentials: true });
    } catch {
      toast.error('logout error');
    }

    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const hasPermission = (action) => {
    if (!user) {
      return false;
    }

    const permissions = {
      manage_users: user.role === 'admin',
      assign_tickets: user.role === 'tech_lead',
      view_all_tickets: true,
      create_tickets: true,

      update_ticket_status: user.role === 'developer',
      log_time: user.role === 'developer',
      forward_tickets: user.role === 'developer',

      view_dashboard: true,
      add_comments: true,

      delete_tickets: user.role === 'tech_lead',
      view_user_management: user.role === 'admin',
    };

    return permissions[action] || false;
  };

  const getTmNavigationItems = () =>
    user
      ? [
          { id: 'TmDashboard', name: 'Dashboard', href: '/tm/dashboard' },
          { id: 'TmAssignment', name: 'Assignment', href: '/tm/assignment' },
          { id: 'TmTicktes', name: 'Ticktes', href: '/tm/tickets' },
        ]
      : [];

  const getAmNavigationItems = () =>
    user
      ? [
          {
            id: 'AmDashboard',
            name: 'Dashboard',
            href: user.role === 3 ? '/am/dashboard-user' : '/am/dashboard',
          },
          {
            id: 'AmAttendance',
            name: 'Attendance',
            href: '/am/attendance',
          },
          {
            id: 'AmLeave',
            name: 'Leave',
            href: user.role === 3 || user.role === 2 ? '/am/myleave-user' : '/am/myleave',
          },
        ]
      : [];

  const getPmNavigationItems = () =>
    user
      ? [
          {
            id: 'PmDashboard',
            name: 'Dashboard',
            href: user.role === 3 ? '/pm/dashboard-user' : '/pm/dashboard',
          },
          {
            id: 'PmProjects',
            name: 'Projects',
            href: user.role === 3 ? '/pm/projects-user' : '/pm/projects',
          },
          {
            id: 'PmTasks',
            name: 'My tasks',
            href: user.role === 3 ? '/pm/tasks-user' : '/pm/tasks',
          },
          {
            id: 'PmTimesheet',
            name: 'Timesheet',
            href: user.role === 3 ? '/pm/timesheet-user' : '/pm/timesheet',
          },

        ]
      : [];

const getHrNavigationItems = () =>
  user
    ? [
        {
          id: 'HrDashboard',
          name: 'Dashboard',
          href:
            user.role === 3||user.role===2
              ? '/hr/dashboard-user'
              : '/hr/dashboard',
        },
        {
          id: 'HrEmployees',
          name: 'Employees',
          href:
            user.role === 3||user.role===2
              ? '/hr/employees-user'
              : '/hr/employees',
        },
        {
          id: 'HrPayroll',
          name: 'Payroll',
          href:
            user.role === 3||user.role===2
              ? '/hr/payroll-user'
              : '/hr/payroll',
        },
        {
          id: 'HrPerformance',
          name: 'Performance',
          href:
            user.role === 3
              ? '/hr/performance-user'
              : '/hr/performance',
        },
      ]
    : [];


  const getUmNavigationItems = () =>
    user
      ? [
          { id: 'UmDashboard', name: 'Dashboard', href: '/um/dashboard' },
          { id: 'UmUsers', name: 'Users', href: '/um/users' },
          { id: 'UmPermission', name: 'Permission', href: '/um/permission' },
        ]
      : [];

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasPermission,
    getPmNavigationItems,
    getHrNavigationItems,
    getTmNavigationItems,
    getAmNavigationItems,
    getUmNavigationItems,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
