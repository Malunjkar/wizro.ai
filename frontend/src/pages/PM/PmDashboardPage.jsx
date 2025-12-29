import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Users,
  Box,
  CheckCircle,
  ClipboardList,
  PieChart as PieIcon,
  Loader2,
  RefreshCcw,
  BarChart2,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosConfig';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
export default function PmDashboardPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');

  const COLORS = ['#60A5FA', '#34D399', '#FBBF24', '#FB7185', '#C084FC'];

  const { user } = useAuth();
  const name = user?.fullName;

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setRefreshing(true);

      await Promise.all([fetchProjects(), fetchTasks(), fetchEmployees(), fetchStatuses()]);

      toast.success('Latest records fetched successfully!');
    } catch (err) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get('pm/getProjects');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Error fetching projects');
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get('pm/getTask');
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Error loading tasks');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get('pm/getEmp');
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Error loading employees');
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axiosInstance.get('pm/taskStatus');
      setStatuses(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Error loading status list');
    }
  };

  // Derived metrics
  const metrics = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(
      (p) => (p.status ?? p.s_status_name ?? '').toLowerCase() !== 'completed',
    ).length;
    const tasksInProgress = tasks.filter((t) => (t.status_name ?? '').toLowerCase() === 'in-progress').length;
    const overdueTasks = tasks.filter((t) => {
      if (!t.task_deadline && !t.d_due_date) return false;
      const d = new Date(t.task_deadline ?? t.d_due_date);
      const today = new Date();
      return d < today && String(t.status_name ?? '').toLowerCase() !== 'completed';
    }).length;

    return { totalProjects, activeProjects, tasksInProgress, overdueTasks };
  }, [projects, tasks]);

  const projectStatusCount = useMemo(() => {
    const map = {};

    projects.forEach((p) => {
      const status = (p.status ?? p.s_status_name ?? 'unknown').toLowerCase();
      map[status] = (map[status] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [projects]);

  const taskStatusSummary = useMemo(() => {
    const map = {};

    tasks.forEach((t) => {
      const status = (t.status_name ?? t.status ?? 'unknown').toLowerCase();
      map[status] = (map[status] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [tasks]);

  const filteredProjects = projects.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (p.project_name ?? '').toLowerCase().includes(s) || (p.project_lead ?? '').toLowerCase().includes(s);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-indigo-600" />
              Project Management — {name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Overview of projects, tasks and team workload</p>
          </div>

          <div className="flex items-center justify-between">
            <Button size="sm" onClick={fetchAll} disabled={refreshing} className="flex items-center gap-2">
              {refreshing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>

        {/* top metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <CardHeader className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <Box className="w-6 h-6 text-indigo-600" />
                <div>
                  <div className="text-sm text-gray-500">Total Projects</div>
                  <div className="text-xl font-semibold">{metrics.totalProjects}</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="p-4">
            <CardHeader className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <BarChart2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-sm text-gray-500">Active Projects</div>
                  <div className="text-xl font-semibold">{metrics.activeProjects}</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="p-4">
            <CardHeader className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Tasks In Progress</div>
                  <div className="text-xl font-semibold">{metrics.tasksInProgress}</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="p-4">
            <CardHeader className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-rose-500" />
                <div>
                  <div className="text-sm text-gray-500">Overdue Tasks</div>
                  <div className="text-xl font-semibold">{metrics.overdueTasks}</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Charts*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-4 col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Projects by Status
              </h3>
              <div className="text-sm text-muted-foreground">Status-wise summary</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {projectStatusCount.map((p) => {
                const status = p.name.toLowerCase();

                const colorMap = {
                  completed: 'bg-green-100 text-green-700 border-green-300',
                  'in-progress': 'bg-blue-100 text-blue-700 border-blue-300',
                  testing: 'bg-purple-100 text-purple-700 border-purple-300',
                  planning: 'bg-amber-100 text-amber-700 border-amber-300',
                  'on-hold': 'bg-rose-100 text-rose-700 border-rose-300',
                  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                };

                const colorClass = colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-300';

                return (
                  <div
                    key={p.name}
                    className={`p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center hover:shadow-md transition ${colorClass}`}
                  >
                    <div className="text-sm font-medium capitalize">{p.name}</div>
                    <div className="text-3xl font-bold mt-1">{p.value}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Task Status Summary (Replaces Team Load) */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Task Status Summary</h3>
              <div className="text-sm text-muted-foreground">Overall task distribution</div>
            </div>

            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskStatusSummary} dataKey="value" nameKey="name" outerRadius={70} innerRadius={30} label>
                    {taskStatusSummary.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* status breakdown & recent projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Task Status Breakdown */}
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">Task Status Breakdown</h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskStatusSummary} dataKey="value" nameKey="name" outerRadius={70} label>
                    {taskStatusSummary.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Projects */}
          <Card className="p-4 col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Recent Projects</h3>
              <Button size="sm" onClick={fetchAll} disabled={refreshing} className="flex items-center gap-2">
                {refreshing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4" />
                    Refresh
                  </>
                )}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-600">
                    <th className="p-3">Project</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Lead</th>
                    <th className="p-3">Start</th>
                    <th className="p-3">End</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.slice(0, 6).map((p) => (
                    <tr key={p.n_project_id ?? p.project_id} className="border-t">
                      <td className="p-3 font-medium">{p.project_name ?? p.s_project_name}</td>
                      <td className="p-3 text-sm">{p.status ?? p.s_status_name}</td>
                      <td className="p-3">{p.project_lead ?? p.s_project_lead}</td>
                      <td className="p-3">{p.start_date ?? p.d_start_date}</td>
                      <td className="p-3">{p.end_date ?? p.d_end_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
