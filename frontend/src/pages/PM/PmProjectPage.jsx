import { Plus, ClipboardList, Pencil, Filter, ArrowUpDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

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

export default function PmProjectPage() {
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  const [showCreateProject, setShowCreateProject] = useState(false);

  const [projectName, setProjectName] = useState('');

  const [projectDescription, setProjectDescription] = useState('');

  const [leadId, setLeadId] = useState('');

  const [startDate, setStartDate] = useState('');

  const [deadlineDate, setDeadlineDate] = useState('');

  const [statusId, setStatusId] = useState('');

  const [statusList, setStatusList] = useState([]);

  const [employees, setEmployees] = useState([]);

  const [projects, setProjects] = useState([]);

  // edit
  const [isEditMode, setIsEditMode] = useState(false);

  const [editingProjectId, setEditingProjectId] = useState(null);

  // Create team state
  const [teamProjectId, setTeamProjectId] = useState('');

  const [teamLeadName, setTeamLeadName] = useState('');

  const [teamName, setTeamName] = useState('');

  const [teamCount, setTeamCount] = useState(0);

  const [selectedMembers, setSelectedMembers] = useState([]);

  //filter and sort
  const [filterStatus, setFilterStatus] = useState('all');

  const [sortOrder, setSortOrder] = useState('asc');

  const [searchTerm, setSearchTerm] = useState('');

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
      const [statusRes, userRes] = await Promise.all([
        axiosInstance.get('pm/projectStatus'),
        axiosInstance.get('pm/getEmp'),
      ]);

      setStatusList(Array.isArray(statusRes.data) ? statusRes.data : statusRes.data ? [statusRes.data] : []);
      setEmployees(Array.isArray(userRes.data) ? userRes.data : userRes.data ? [userRes.data] : []);
    } catch {
      toast.error('Error fetching employess');
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

  useEffect(() => {
    fetchDropdownData();
    fetchProjects();
  }, []);

  const handleSaveProject = async () => {
    if (!projectName || !leadId || !startDate || !deadlineDate || !statusId) {
      return;
    }

    try {
      if (isEditMode) {
        // UPDATE
        await axiosInstance.post(`pm/updateProject/${editingProjectId}`, {
          pName: projectName,
          pDesc: projectDescription,
          leadId: Number(leadId),
          startDate,
          endDate: deadlineDate,
          statusId: Number(statusId),
        });

        toast.success('Project updated successfully');
      } else {
        // CREATE
        await axiosInstance.post('pm/addProject', {
          pName: projectName,
          pDesc: projectDescription,
          leadId: Number(leadId),
          startDate,
          endDate: deadlineDate,
          statusId: Number(statusId),
        });

        toast.success('Project created successfully');
      }

      // reset
      setShowCreateProject(false);

      resetProjectForm();

      fetchProjects();
    } catch {
      toast.error('Error saving project');
    }
  };

  useEffect(() => {
    if (!teamProjectId) {
      setTeamLeadName('');

      return;
    }

    const project = projects.find((p) => String(p.n_project_id) === String(teamProjectId));

    if (project) {
      setTeamLeadName(project.project_lead || '');

      if (project.team_lead) {
        setSelectedMembers([String(project.team_lead)]);
      }
    } else {
      setTeamLeadName('');
    }
  }, [teamProjectId, projects]);

  const handleCreateTeam = async () => {
    if (!teamProjectId || !teamName || !teamCount || selectedMembers.length === 0) {
      return;
    }

    if (selectedMembers.length !== Number(teamCount)) {
      toast.warning('Select exactly the number of members equal to team count (including lead).');

      return;
    }

    try {
      await axiosInstance.post('pm/addTeam', {
        projectId: Number(teamProjectId),
        teamName: teamName,
        teamCount: Number(teamCount),
        memberIds: selectedMembers.map((id) => Number(id)),
      });
      toast.success('Team created successfully');

      setShowCreateTeam(false);
      setTeamProjectId('');
      setTeamLeadName('');
      setTeamName('');
      setTeamCount(0);
      setSelectedMembers([]);

      fetchProjects();
    } catch {
      toast.error('Error creating team');
    }
  };

  const toggleMember = (id) => {
    const exists = selectedMembers.includes(id);

    if (exists) {
      setSelectedMembers(selectedMembers.filter((m) => m !== id));

      return;
    }
    if (selectedMembers.length >= Number(teamCount) && Number(teamCount) > 0) {
      toast.info('Already selected maximum team members');

      return;
    }
    setSelectedMembers([...selectedMembers, id]);
  };

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

  const resetProjectForm = () => {
    setIsEditMode(false);
    setEditingProjectId(null);
    setProjectName('');
    setProjectDescription('');
    setLeadId('');
    setStartDate('');
    setDeadlineDate('');
    setStatusId('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-600" /> Project Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage company-wide projects efficiently</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setShowCreateProject(true)} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" /> Create Project
            </Button>
            <Button onClick={() => setShowCreateTeam(true)} size="lg" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" /> Create Team
            </Button>
          </div>
        </div>

        {/* CREATE PROJECT DIALOG */}
        <Dialog
          open={showCreateProject}
          onOpenChange={(isOpen) => {
            setShowCreateProject(isOpen);
            if (!isOpen) {
              resetProjectForm();
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Project' : 'Create New Project'}</DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Update project details.' : 'Fill in the details to create a new project.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  className="w-full border rounded-lg p-2 text-sm"
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <Label>Deadline</Label>
                  <Input type="date" value={deadlineDate} onChange={(e) => setDeadlineDate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Project Lead</Label>
                  <select
                    value={leadId}
                    onChange={(e) => setLeadId(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="">Select Lead</option>
                    {employees.map((u) => (
                      <option key={u.n_user_id} value={u.n_user_id}>
                        {u.s_full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Status</Label>
                  <select
                    value={statusId}
                    onChange={(e) => setStatusId(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
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
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateProject(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProject}>{isEditMode ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* CREATE TEAM DIALOG */}
        <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Team</DialogTitle>
              <DialogDescription>Select project and create team.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label>Select Project</Label>
                <select
                  value={teamProjectId}
                  onChange={(e) => setTeamProjectId(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.n_project_id} value={p.n_project_id}>
                      {p.project_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Team Lead</Label>
                <Input disabled value={teamLeadName} placeholder="Auto fetched" />
              </div>

              <div>
                <Label>Team Name</Label>
                <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} />
              </div>

              <div>
                <Label>Team Count</Label>
                <Input type="number" value={teamCount} onChange={(e) => setTeamCount(e.target.value)} />
              </div>

              <div>
                <Label>Select Members</Label>
                <div className="grid grid-cols-2 gap-2 h-32 overflow-y-auto border rounded p-2">
                  {employees.map((e) => (
                    <label key={e.n_user_id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(String(e.n_user_id))}
                        onChange={() => toggleMember(String(e.n_user_id))}
                      />
                      {e.s_full_name}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateTeam(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeam}>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card className="border-border">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Filters + Sorting */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 rounded-lg border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Status</option>
                {statusList.map((s) => (
                  <option key={s.n_status_id} value={s.s_status_name}>
                    {s.s_status_name}
                  </option>
                ))}
              </select>

              {/* Sort Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort by Start Date ({sortOrder === 'asc' ? '↑' : '↓'})
              </Button>
            </div>

            {/* Search */}
            <Input
              type="text"
              placeholder="Search project or lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
          </CardHeader>
        </Card>

        {/* PROJECT TABLE */}
        <Card className="border border-gray-200 shadow-sm p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                  <th className="p-3">Project Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                  <th className="p-3">Project Lead</th>
                  <th className="p-3">Team Count</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-800">
                {filteredProjects.map((p) => (
                  <tr key={p.n_project_id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{p.project_name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3">{p.start_date}</td>
                    <td className="p-3">{p.end_date}</td>
                    <td className="p-3">{p.project_lead}</td>
                    <td className="p-3 text-center">{p.team_count}</td>
                    <td className="p-3 cursor-pointer text-gray-600">
                      <Pencil
                        className="w-5 h-5"
                        onClick={() => {
                          setIsEditMode(true);
                          setEditingProjectId(p.n_project_id);

                          setProjectName(p.project_name);
                          setProjectDescription(p.description || '');
                          setLeadId(p.team_lead);
                          setStartDate(p.start_date);
                          setDeadlineDate(p.end_date);
                          setStatusId(p.n_status_id);

                          setShowCreateProject(true);
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
