import {
  Users,
  ShieldCheck,
  KeyRound,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import PageHeader from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';

const API_BASE = 'http://localhost:5000/user';

export default function UmDashboardPage() {
  const { hasPermission } = useAuth();

  /* ---------------- STATE ---------------- */
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [filter, setFilter] = useState('All Users');

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetch(`${API_BASE}/getAll`)
      .then((res) => res.json())
      .then(setUsers);
    fetch(`${API_BASE}/role/getAll`)
      .then((res) => res.json())
      .then(setRoles);
    fetch(`${API_BASE}/permission/getAll`)
      .then((res) => res.json())
      .then(setPermissions);
  }, []);

  /* ---------------- CALCULATIONS ---------------- */

  // Total users
  const totalUsers = users.length;

  // Status-wise counts
  const activeCount = users.filter((u) => u.n_status === 1).length;
  const inactiveCount = users.filter((u) => u.n_status === 2).length;
  const onLeaveCount = users.filter((u) => u.n_status === 3).length;
  const suspendedCount = users.filter((u) => u.n_status === 4).length;

  // User status cards (separate)
  const userStatusCards = [
    {
      title: 'Active Users',
      count: activeCount,
      icon: ShieldCheck,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Inactive Users',
      count: inactiveCount,
      icon: Users,
      color: 'text-gray-600',
      bg: 'bg-gray-100 dark:bg-gray-800',
    },
    {
      title: 'On Leave',
      count: onLeaveCount,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      title: 'Suspended',
      count: suspendedCount,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
  ];

  // Top stats cards
  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Active Users',
      value: activeCount,
      icon: ShieldCheck,
      trend: 'up',
    },
    {
      title: 'Roles',
      value: roles.length,
      icon: KeyRound,
      trend: 'neutral',
    },
    {
      title: 'Permissions',
      value: permissions.length,
      icon: FileText,
      trend: 'neutral',
    },
  ];

  // Recently added users
  const recentUsers = [...users].sort((a, b) => b.n_user_id - a.n_user_id).slice(0, 5);

  /* ---------------- ACCESS CONTROL ---------------- */
  if (!hasPermission('USER_MANAGEMENT')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="p-6">
        {/* HEADER */}
        <PageHeader
          title="User Management Dashboard"
          subTitle="Overview of users, roles & permissions"
          actions={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {filter} <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter('All Users')}>All Users</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('Active Users')}>Active Users</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('Inactive Users')}>Inactive Users</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;

            return (
              <Card
                key={index}
                className="relative overflow-hidden bg-gradient-to-br from-[var(--color-card)] to-[var(--color-muted)] 
             border-[var(--color-border)] hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-muted-foreground)]">{stat.title}</p>
                    <p className="text-4xl font-bold mt-2 tracking-tight">{stat.value}</p>
                  </div>

                  <div className="p-4 rounded-full bg-[var(--color-primary)]/10">
                    <Icon className="w-7 h-7 text-[var(--color-primary)]" />
                  </div>
                </CardContent>

                {/* Accent bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-primary)]" />
              </Card>
            );
          })}
        </div>

        {/* USER STATUS (LEFT) + RECENT USERS (RIGHT) */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT SIDE — USER STATUS OVERVIEW */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-[var(--color-foreground)]">User Status Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
              {userStatusCards.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={index}
                    className={`cursor-pointer border-[var(--color-border)] ${item.bg}
            hover:scale-[1.02] hover:shadow-md transition-all duration-300`}
                  >
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--color-muted-foreground)]">{item.title}</p>
                        <p className="text-4xl font-bold mt-2">{item.count}</p>
                      </div>

                      <div className="p-4 rounded-full bg-white/60 dark:bg-black/30">
                        <Icon className={`w-7 h-7 ${item.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE — RECENT USERS */}
          <div className="lg:col-span-5 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-[var(--color-foreground)]">Recently Added Users</h2>

            <Card className="bg-[var(--color-card)] border-[var(--color-border)] h-full flex flex-col">
              <CardHeader>
                <CardTitle>Latest Users</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 overflow-y-auto pr-2">
                {recentUsers.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted-foreground)]">No recent users found</p>
                ) : (
                  recentUsers.map((user) => (
                    <div
                      key={user.n_user_id}
                      className="group flex justify-between items-center p-4 rounded-xl 
              bg-[var(--color-muted)] hover:bg-[var(--color-card)] 
              border border-transparent hover:border-[var(--color-border)]
              transition-all duration-300"
                    >
                      <div>
                        <p className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)]">
                          {user.s_full_name}
                        </p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">{user.s_email}</p>
                      </div>

                      <Badge
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.n_status === 1
                            ? 'bg-green-100 text-green-700'
                            : user.n_status === 2
                              ? 'bg-gray-100 text-gray-700'
                              : user.n_status === 3
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.n_status === 1
                          ? 'Active'
                          : user.n_status === 2
                            ? 'Inactive'
                            : user.n_status === 3
                              ? 'On Leave'
                              : 'Suspended'}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SECURITY NOTICE */}
        <div className="mt-8">
          <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <p className="text-sm">Ensure every role has required permissions assigned to avoid access issues.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
