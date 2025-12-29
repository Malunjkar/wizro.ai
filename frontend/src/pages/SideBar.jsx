import React from 'react';

const Sidebar = ({ roleId }) => {
  // 1. Define all sidebar modules (universal)
  const allModules = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'Attendance', icon: '🕒', path: '/attendance' },
    { name: 'Leave', icon: '🌴', path: '/leave' },
    { name: 'Projects', icon: '📁', path: '/projects' },
    { name: 'Employees', icon: '👥', path: '/employees' },
    { name: 'Clients', icon: '🤝', path: '/clients' },
    { name: 'Payroll', icon: '💰', path: '/payroll' },
  ];

  // 2. Define role-wise access (instead of utils)
  const roleAccess = {
    1: ['Dashboard', 'Attendance', 'Leave', 'Projects', 'Employees', 'Clients', 'Payroll'], // Admin
    2: ['Dashboard', 'Attendance', 'Projects', 'Leave'], // Project Manager
    3: ['Dashboard', 'Attendance', 'Leave'], // Employee
  };

  // 3. Filter modules dynamically based on role
  const accessibleModules = allModules.filter((mod) => roleAccess[roleId]?.includes(mod.name));

  // 4. Render sidebar
  return (
    <div className="bg-white shadow-md w-64 p-4 h-full">
      <ul className="space-y-3">
        {accessibleModules.map((mod) => (
          <li
            key={mod.name}
            className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition"
          >
            <span>{mod.icon}</span>
            <span>{mod.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
