import { ClipboardList, Pencil, Filter, ArrowUpDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/axiosConfig';

export default function PmProjectUser() {
  const { user } = useAuth();

  const userId = user?.empID;

  const [projects, setProjects] = useState([]);

  const [statusList, setStatusList] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);

  const [editingProjectId, setEditingProjectId] = useState(null);

  const [projectName, setProjectName] = useState('');

  const [projectDescription, setProjectDescription] = useState('');

  const [showEditProject, setShowEditProject] = useState(false);

  const [_leadId, setLeadId] = useState('');

  const [startDate, setStartDate] = useState('');

  const [deadlineDate, setDeadlineDate] = useState('');

  const [statusId, setStatusId] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');

  const [sortOrder, setSortOrder] = useState('asc');

  const [searchTerm, setSearchTerm] = useState('');

  const fetchUserProjects = async () => {
    try {
      const res = await axiosInstance.get(`pm/getProjectByUser/${userId}`);
      setProjects(Array.isArray(res.data) ? res.data : []);
      toast.success('Fetched Project succesfully');
    } catch {
      toast.error('Error fetching projects');
    }
  };

  const filteredProjects = projects
    .filter((p) => {
      if (filterStatus === 'all') {
        return true;
      }

      return p.status?.toLowerCase() === filterStatus.toLowerCase();
    })
    .filter((p) => {
      const search = searchTerm.toLowerCase();

      return p.project_name?.toLowerCase().includes(search) || p.project_lead?.toLowerCase().includes(search);
    })
    .sort((a, b) => {
      const dateA = new Date(a.start_date);

      const dateB = new Date(b.start_date);

      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const fetchDropdownData = async () => {
    try {
      const [statusRes] = await Promise.all([axiosInstance.get('pm/projectStatus')]);

      setStatusList(Array.isArray(statusRes.data) ? statusRes.data : statusRes.data ? [statusRes.data] : []);
    } catch {
      toast.error('Status Error');
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchUserProjects();
  }, []);

  const statusBadgeClass = (statusName) => {
    const s = String(statusName).toLowerCase();

    switch (s) {
      case 'assigned':
        return 'bg-indigo-200 text-indigo-700';
      case 'planning':
        return 'bg-gray-200 text-gray-700';
      case 'development':
        return 'bg-blue-200 text-blue-700';
      case 'testing':
        return 'bg-yellow-200 text-yellow-700';
      case 'completed':
        return 'bg-green-200 text-green-700';
      case 'closed':
        return 'bg-red-200 text-red-700';
      default:
        return 'bg-purple-200 text-purple-700';
    }
  };

  const editProject = async () => {
    if (!statusId) {
      return;
    }

    try {
      if (isEditMode) {
        await axiosInstance.post(`pm/updateProjectStatus/${editingProjectId}`, {
          desc: projectDescription,
          statusId: Number(statusId),
        });
        toast.success('Project updated successfully');
        setShowEditProject(false);
      }
      fetchUserProjects();
    } catch {
      toast.error('Error Updating project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-8xl mx-auto space-y-6 px-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList className="w-7 h-7 text-indigo-600" />
              My Assigned Projects
            </h1>
            <p className="text-sm text-gray-500 mt-1">View and update your project progress</p>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={showEditProject} onOpenChange={(v) => setShowEditProject(v)}>
          <DialogContent className="sm:max-w-[600px] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Update Project Status</DialogTitle>
              <DialogDescription>You can only update status and description.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-medium">Project Name</Label>
                <Input value={projectName} disabled className="bg-gray-100" />
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Description</Label>
                <textarea
                  rows={3}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Start Date</Label>
                  <Input type="date" value={startDate} disabled className="bg-gray-100" />
                </div>
                <div>
                  <Label className="font-medium">Deadline</Label>
                  <Input type="date" value={deadlineDate} disabled className="bg-gray-100" />
                </div>
              </div>

              <div>
                <Label className="font-medium">Status</Label>
                <select
                  value={statusId}
                  onChange={(e) => setStatusId(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Status</option>
                  {statusList.map((s) => (
                    <option key={s.n_status_id} value={s.n_status_id}>
                      {s.s_status_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditProject(false)}>
                Cancel
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={editProject}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Filters Section */}
        <Card className="border shadow-sm rounded-xl">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-gray-600" />

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border bg-white text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                {statusList.map((s) => (
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

            <Input
              type="text"
              placeholder="Search project or lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
          </CardHeader>
        </Card>

        {/* Project Table */}
        <Card className="shadow-sm border rounded-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-200 text-left text-xs font-semibold text-gray-700">
                  <th className="p-3">Project</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Start</th>
                  <th className="p-3">End</th>
                  <th className="p-3">Lead</th>
                  <th className="p-3">Team</th>
                  <th className="p-3">Edit</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-800">
                {filteredProjects.map((p) => (
                  <tr key={p.n_project_id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 font-medium">{p.project_name}</td>

                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="p-3">{p.start_date}</td>
                    <td className="p-3">{p.end_date}</td>
                    <td className="p-3">{p.project_lead}</td>
                    <td className="p-3 text-center">{p.team_count}</td>

                    <td className="p-3 text-gray-600 cursor-pointer">
                      <Pencil
                        className="w-5 h-5 hover:text-indigo-600 transition"
                        onClick={() => {
                          setIsEditMode(true);
                          setEditingProjectId(p.n_project_id);

                          setProjectName(p.project_name);
                          setProjectDescription(p.description || '');
                          setLeadId(p.team_lead);
                          setStartDate(p.start_date);
                          setDeadlineDate(p.end_date);
                          setStatusId(p.n_status_id);

                          setShowEditProject(true);
                        }}
                      />
                    </td>
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
