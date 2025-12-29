// PmDashboardUser.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ClipboardList, Calendar, CheckCircle, User } from 'lucide-react';
import { toast } from 'sonner';

import axiosInstance from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


export default function PmDashboardUser() {
  const { user } = useAuth();
  const userId = user?.empID;

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUserProjects();
    fetchTasksForUser();
    fetchStatuses();
  }, [userId]);

  const fetchUserProjects = async () => {
    try {
      const res = await axiosInstance.get(`pm/getProjectByUser/${userId}`);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Error fetching projects');
    }
  };

  const fetchTasksForUser = async () => {
    try {
      const res = await axiosInstance.get(`pm/getUserTask/${userId}`);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Error loading tasks');
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

  const metrics = useMemo(() => {
    const totalProjects = projects.length;
    const pending = tasks.filter((t) => (t.status_name ?? '').toLowerCase() === 'todo').length;
    const inProgress = tasks.filter((t) => (t.status_name ?? '').toLowerCase() === 'in-progress').length;
    const completed = tasks.filter((t) => (t.status_name ?? '').toLowerCase() === 'completed').length;
    return { totalProjects, pending, inProgress, completed };
  }, [projects, tasks]);

  const taskBreakdown = useMemo(() => {
    const counts = [
      { name: 'todo', value: metrics.pending },
      { name: 'in-progress', value: metrics.inProgress },
      { name: 'completed', value: metrics.completed },
    ];
    return counts;
  }, [metrics]);

  const COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
  ];

  const filteredTasks = tasks.filter((t) => {
    if (!search) return true;
    return (t.task_name ?? '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-indigo-600" />
              My Project Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">Personal view of your projects and tasks</p>
          </div>

          <div className="flex items-center gap-3">
            <Input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button
              onClick={() => {
                fetchUserProjects();
                fetchTasksForUser();
              }}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <CardHeader>
              <div className="text-sm text-gray-500">Total Projects</div>
              <div className="text-xl font-semibold">{metrics.totalProjects}</div>
            </CardHeader>
          </Card>
          <Card className="p-4">
            <CardHeader>
              <div className="text-sm text-gray-500">Pending Tasks</div>
              <div className="text-xl font-semibold">{metrics.pending}</div>
            </CardHeader>
          </Card>
          <Card className="p-4">
            <CardHeader>
              <div className="text-sm text-gray-500">In Progress</div>
              <div className="text-xl font-semibold">{metrics.inProgress}</div>
            </CardHeader>
          </Card>
          <Card className="p-4">
            <CardHeader>
              <div className="text-sm text-gray-500">Completed</div>
              <div className="text-xl font-semibold">{metrics.completed}</div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-4 col-span-2">
            <h3 className="text-lg font-medium mb-3">Tasks</h3>
            <div className="space-y-3">
              {filteredTasks.map((t) => (
                <div
                  key={t.task_id ?? t.n_task_id}
                  className="bg-white rounded-xl p-4 shadow-sm border flex justify-between items-start"
                >
                  <div>
                    <div className="font-medium">{t.task_name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <Calendar className="inline w-4 h-4 mr-2" />
                      {t.task_deadline}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${t.status_name === 'completed' ? 'bg-green-200 text-green-800' : t.status_name === 'in-progress' ? 'bg-blue-200 text-blue-800' : 'bg-indigo-200 text-indigo-800'}`}
                      >
                        {t.status_name}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">{/* actions placeholder */}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">Task Status</h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskBreakdown} dataKey="value" nameKey="name" outerRadius={70} label>
                    {taskBreakdown.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">My Projects</div>
              <div className="font-medium">{projects.length} projects</div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-600">
                  <th className="p-3">Project</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Project Lead</th>
                  <th className="p-3">Team Size</th>
                  <th className="p-3">Start</th>
                  <th className="p-3">End</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((p) => (
                  <tr key={p.n_project_id ?? p.project_id} className="border-t">
                    <td className="p-3 font-medium">{p.project_name}</td>

                    <td className="p-3 capitalize">{p.status}</td>

                    <td className="p-3">{p.project_lead ?? '—'}</td>

                    <td className="p-3">{p.team_count ?? '—'}</td>

                    <td className="p-3">{p.start_date}</td>

                    <td className="p-3">{p.end_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
