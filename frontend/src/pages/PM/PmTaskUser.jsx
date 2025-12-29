import { Filter, ArrowUpDown, Calendar, Edit, ClipboardList } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';

export default function PmTaskUserPage() {
  const { user } = useAuth();
  const userId = user?.empID;

  const [statuses, setStatuses] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // USER EDIT MODAL STATES
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDesc, setEditingDesc] = useState('');
  const [editingStatusId, setEditingStatusId] = useState('');

  // REQUIRED FOR UPDATE API
  const [editingPriority, setEditingPriority] = useState('');
  const [editingDueDate, setEditingDueDate] = useState('');
  const [editingAssignedUser, setEditingAssignedUser] = useState('');

  useEffect(() => {
    fetchStatuses();
    fetchTasks();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await axiosInstance.get('pm/taskStatus');
      setStatuses(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Error loading status list');
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get(`pm/getUserTask/${userId}`);
      setTasks(Array.isArray(res.data) ? res.data : []);
      toast.success('Fetched Task successfully');
    } catch {
      toast.error('Error loading tasks');
    }
  };

  const statusBadgeClass = (statusName) => {
    const s = String(statusName).toLowerCase();
    switch (s) {
      case 'todo':
        return 'bg-indigo-200 text-indigo-700';
      case 'in-progress':
        return 'bg-blue-200 text-blue-700';
      case 'completed':
        return 'bg-green-200 text-green-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const openStatusDialog = (task) => {
    setEditingTaskId(task.n_task_id ?? task.task_id ?? null);
    setEditingTitle(task.task_name ?? '');
    setEditingDesc(task.task_desc ?? '');
    setEditingStatusId(task.status_id ?? task.n_status_id ?? '');

    setEditingPriority(task.task_priority ?? 'Medium');
    setEditingDueDate(task.task_deadline ?? '');
    setEditingAssignedUser(userId);

    setShowStatusDialog(true);
  };

  const handleUpdateTaskStatus = async () => {
    if (!editingStatusId) {
      toast.warning('Select status');
      return;
    }

    try {
      await axiosInstance.post(`pm/updateTask/${editingTaskId}`, {
        title: editingTitle,
        description: editingDesc,
        priority: editingPriority,
        statusId: Number(editingStatusId),
        due_date: editingDueDate,
        assigned_to_user_id: editingAssignedUser,
      });

      toast.success('Task updated');
      setShowStatusDialog(false);
      fetchTasks();
    } catch {
      toast.error('Update failed');
    }
  };

  // FILTERING + SORTING
  const filtered = tasks
    .filter((t) => {
      if (filterStatus === 'all') return true;
      return (t.status_name ?? '').toLowerCase() === filterStatus.toLowerCase();
    })
    .filter((t) => {
      const s = searchTerm.toLowerCase();
      return (t.task_name ?? '').toLowerCase().includes(s);
    })
    .sort((a, b) => {
      const d1 = new Date(a.task_deadline ?? a.d_due_date);
      const d2 = new Date(b.task_deadline ?? b.d_due_date);
      return sortOrder === 'asc' ? d1 - d2 : d2 - d1;
    });

  const colTodo = filtered.filter((t) => Number(t.status_id) === 1);
  const colInProgress = filtered.filter((t) => Number(t.status_id) === 2);
  const colCompleted = filtered.filter((t) => Number(t.status_id) === 3);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-8xl mx-auto space-y-6 px-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
            My Tasks
          </h1>
        </div>

        {/* Filters */}
        <Card className="border shadow-sm rounded-xl">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-gray-600" />

              <Input
                placeholder="Search task..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-[220px]"
              />

              <select
                className="border rounded px-3 py-1"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                {statuses.map((s) => (
                  <option key={s.n_status_id} value={s.s_status_name}>
                    {s.s_status_name}
                  </option>
                ))}
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort ({sortOrder === 'asc' ? '↑' : '↓'})
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="To-do"
            count={colTodo.length}
            tasks={colTodo}
            statusBadgeClass={statusBadgeClass}
            openStatusDialog={openStatusDialog}
          />
          <TaskColumn
            title="In-Progress"
            count={colInProgress.length}
            tasks={colInProgress}
            statusBadgeClass={statusBadgeClass}
            openStatusDialog={openStatusDialog}
          />
          <TaskColumn
            title="Completed"
            count={colCompleted.length}
            tasks={colCompleted}
            statusBadgeClass={statusBadgeClass}
            openStatusDialog={openStatusDialog}
          />
        </div>

        {/* User Edit Modal */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent className="sm:max-w-[450px] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Update Task</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <Label className="font-medium">Task Title</Label>
                <Input value={editingTitle} disabled className="bg-gray-100" />
              </div>

              <div>
                <Label className="font-medium">Description</Label>
                <textarea
                  rows={3}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  value={editingDesc}
                  onChange={(e) => setEditingDesc(e.target.value)}
                />
              </div>

              <div>
                <Label className="font-medium">Status</Label>
                <select
                  value={editingStatusId}
                  onChange={(e) => setEditingStatusId(e.target.value)}
                  className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Status</option>
                  {statuses.map((s) => (
                    <option key={s.n_status_id} value={s.n_status_id}>
                      {s.s_status_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleUpdateTaskStatus}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

/* TASK COLUMN UI */
function TaskColumn({ title, count, tasks, statusBadgeClass, openStatusDialog }) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
        {title}
        <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
      </h3>

      <div className="space-y-4">
        {tasks.map((t) => (
          <div key={t.task_id} className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{t.task_name}</h4>
            </div>

            <div className="mt-3 text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{t.task_deadline}</span>
              </div>

              <div>
                <span className={`px-2 py-1 rounded text-xs ${statusBadgeClass(t.status_name)}`}>{t.status_name}</span>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm"
                onClick={() => openStatusDialog(t)}
              >
                <Edit className="w-4 h-4" /> Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
