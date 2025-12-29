import { Plus, Filter, ArrowUpDown, Calendar, User, Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/axiosConfig';

export default function PmTaskPage() {
  const [employees, setEmployees] = useState([]);

  const [statuses, setStatuses] = useState([]);

  const [tasks, setTasks] = useState([]);

  const [filterPriority, setFilterPriority] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

  const [searchTerm, setSearchTerm] = useState('');

  const [sortOrder, setSortOrder] = useState('asc');

  // Add Task Modal
  const [showAddTask, setShowAddTask] = useState(false);

  const [title, setTitle] = useState('');

  const [desc, setDesc] = useState('');

  const [priority, setPriority] = useState('Medium');

  const [dueDate, setDueDate] = useState('');

  const [assignedUser, setAssignedUser] = useState('');

  // Edit (Admin) Modal
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [editingStatusId, setEditingStatusId] = useState('');

  // New states to edit full task (admin)
  const [editingTitle, setEditingTitle] = useState('');

  const [editingDesc, setEditingDesc] = useState('');

  const [editingPriority, setEditingPriority] = useState('Medium');

  const [editingDueDate, setEditingDueDate] = useState('');

  const [editingAssignedUser, setEditingAssignedUser] = useState('');

  const priorities = ['Urgent', 'High', 'Medium', 'Low'];

  useEffect(() => {
    fetchEmployees();
    fetchStatuses();
    fetchTasks();
  }, []);

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

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get('pm/getTask');

      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Error loading tasks');
    }
  };

  const priorityBadge = (p) => {
    const s = p.toLowerCase();

    switch (s) {
      case 'urgent':
        return 'bg-rose-200 text-rose-700';
      case 'high':
        return 'bg-orange-200 text-orange-700';
      case 'medium':
        return 'bg-amber-200 text-amber-700';
      case 'low':
        return 'bg-green-200 text-green-700';
      default:
        return 'bg-gray-200 text-gray-700';
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
        return 'bg-purple-200 text-purple-700';
    }
  };

  const handleAddTask = async () => {
    if (!title || !assignedUser || !dueDate) {
      toast.warning('Title, Due date & Assignee required');

      return;
    }

    try {
      await axiosInstance.post('pm/addTask', {
        title,
        description: desc,
        priority,
        statusId: 1, // default → todo
        due_date: dueDate,
        assigned_to_user_id: Number(assignedUser),
      });

      toast.success('Task created successfully');
      resetAllTaskForms();

      fetchTasks();
    } catch {
      toast.error('Task creation failed');
    }
  };

  const openStatusDialog = (task) => {
    setEditingTaskId(task.task_id ?? task.n_task_id ?? null);
    setEditingTitle(task.task_name ?? task.s_task_title ?? '');
    setEditingDesc(task.task_desc ?? task.s_task_description ?? '');
    setEditingPriority(task.task_priority ?? task.s_priority ?? 'Medium');
    setEditingDueDate(task.task_deadline ?? task.d_due_date ?? '');
    setEditingStatusId(task.status_id ?? task.status_id ?? task.n_status_id ?? '');
    setEditingAssignedUser(task.assigned_to_user_id ?? task.n_assigned_to_user_id ?? task.assigned_user_id ?? '');
    setShowStatusDialog(true);
  };

  // Update full task (admin)
  const handleUpdateFullTask = async () => {
    if (!editingTitle || !editingDueDate || !editingAssignedUser) {
      toast.warning('Title, Due date & Assignee required');

      return;
    }

    try {
      await axiosInstance.post(`pm/updateTask/${editingTaskId}`, {
        title: editingTitle,
        description: editingDesc,
        priority: editingPriority,
        statusId: Number(editingStatusId),
        due_date: editingDueDate,
        assigned_to_user_id: Number(editingAssignedUser),
      });

      toast.success('Task updated');
      resetAllTaskForms();

      fetchTasks();
    } catch {
      toast.error('Task update failed');
    }
  };

  const handleUpdateTaskStatus = async () => {
    try {
      await axiosInstance.post(`pm/updateTaskStatus/${editingTaskId}`, {
        statusId: Number(editingStatusId),
      });

      toast.success('Status updated');
      setShowStatusDialog(false);
      setEditingTaskId(null);
      setEditingStatusId('');
      fetchTasks();
    } catch {
      toast.error('Status update failed');
    }
  };

  const filtered = tasks
    .filter((t) => {
      if (filterStatus === 'all') {
        return true;
      }

      return (t.status_name ?? t.status ?? '').toLowerCase() === filterStatus.toLowerCase();
    })
    .filter((t) => {
      if (filterPriority === 'all') {
        return true;
      }

      return (t.task_priority ?? t.s_priority ?? '').toLowerCase() === filterPriority.toLowerCase();
    })
    .filter((t) => {
      const s = searchTerm.toLowerCase();

      return (t.task_name ?? '').toLowerCase().includes(s) || (t.emp_name ?? '').toLowerCase().includes(s);
    })
    .sort((a, b) => {
      const d1 = new Date(a.task_deadline ?? a.d_due_date);

      const d2 = new Date(b.task_deadline ?? b.d_due_date);

      return sortOrder === 'asc' ? d1 - d2 : d2 - d1;
    });

  const colTodo = filtered.filter((t) => Number(t.status_id ?? t.status_id ?? t.n_status_id) === 1);

  const colInProgress = filtered.filter((t) => Number(t.status_id ?? t.status_id ?? t.n_status_id) === 2);

  const colCompleted = filtered.filter((t) => Number(t.status_id ?? t.status_id ?? t.n_status_id) === 3);

  const resetAllTaskForms = () => {
    // Close both dialogs
    setShowStatusDialog(false);
    setShowAddTask(false);

    // Reset Add Task fields
    setTitle('');
    setDesc('');
    setPriority('Medium');
    setDueDate('');
    setAssignedUser('');

    // Reset Edit Task fields
    setEditingTaskId(null);
    setEditingStatusId('');
    setEditingTitle('');
    setEditingDesc('');
    setEditingPriority('Medium');
    setEditingDueDate('');
    setEditingAssignedUser('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Task Management</h1>

          <Button onClick={() => setShowAddTask(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Add Task
          </Button>
        </div>

        {/* FILTERS */}
        <Card className="border-border">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4" />

              <Input
                placeholder="Search task..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-[220px]"
              />

              <select
                className="border rounded px-3 py-1"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

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

        {/* 3 COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TODO COLUMN */}
          <TaskColumn
            title="To-do"
            count={colTodo.length}
            tasks={colTodo}
            priorityBadge={priorityBadge}
            statusBadgeClass={statusBadgeClass}
            openStatusDialog={openStatusDialog}
          />

          {/* IN PROGRESS */}
          <TaskColumn
            title="In-Progress"
            count={colInProgress.length}
            tasks={colInProgress}
            priorityBadge={priorityBadge}
            statusBadgeClass={statusBadgeClass}
            openStatusDialog={openStatusDialog}
          />

          {/* COMPLETED */}
          <TaskColumn
            title="Completed"
            count={colCompleted.length}
            tasks={colCompleted}
            priorityBadge={priorityBadge}
            statusBadgeClass={statusBadgeClass}
            openStatusDialog={openStatusDialog}
          />
        </div>

        {/* ADD TASK DIALOG */}
        <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    {priorities.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Due Date</Label>
                  <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Assign To</Label>
                <select
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Employee</option>
                  {employees.map((u) => (
                    <option key={u.n_user_id} value={u.n_user_id}>
                      {u.s_full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddTask(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ADMIN EDIT DIALOG */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent className="sm:max-w-[640px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Title */}
              <div>
                <Label>Title</Label>
                <Input value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} />
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={4}
                  value={editingDesc}
                  onChange={(e) => setEditingDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <Label>Priority</Label>
                  <select
                    value={editingPriority}
                    onChange={(e) => setEditingPriority(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <Label>Due Date</Label>
                  <Input type="date" value={editingDueDate} onChange={(e) => setEditingDueDate(e.target.value)} />
                </div>
              </div>

              {/* Assign To */}
              <div>
                <Label>Assign To</Label>
                <select
                  value={editingAssignedUser}
                  onChange={(e) => setEditingAssignedUser(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Employee</option>
                  {employees.map((u) => (
                    <option key={u.n_user_id} value={u.n_user_id}>
                      {u.s_full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <select
                  value={editingStatusId}
                  onChange={(e) => setEditingStatusId(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select</option>
                  {statuses.map((s) => (
                    <option key={s.n_status_id} value={s.n_status_id}>
                      {s.s_status_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetAllTaskForms}>
                Cancel
              </Button>

              <div className="flex gap-2">
                <Button onClick={handleUpdateFullTask}>Save Changes</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// TASK COLUMN COMPONENT
function TaskColumn({ title, count, tasks, priorityBadge, statusBadgeClass, openStatusDialog }) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
        {title}
        <span className="text-sm text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
      </h3>

      <div className="space-y-4">
        {tasks.map((t) => (
          <div key={t.task_id} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{t.task_name}</h4>

              <div className={`text-xs px-2 py-1 rounded font-semibold ${priorityBadge(t.task_priority)}`}>
                {t.task_priority}
              </div>
            </div>

            <div className="mt-3 text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{t.task_deadline}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{t.emp_name || '—'}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${statusBadgeClass(t.status_name)}`}>{t.status_name}</span>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => openStatusDialog(t)}>
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
