// PmTimesheetUserPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Calendar as CalendarIcon, X, Loader2, Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';

// Export libs
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PmTimesheetUserPage() {
  const { user } = useAuth();
  const userId = user?.empID;

  // ---------------------- STATE ---------------------------
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);

  const [formDate] = useState(getYYYYMMDD(new Date()));
  const [formProjectId, setFormProjectId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formHours, setFormHours] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // ---------------------- HELPERS ---------------------------
  function getYYYYMMDD(d) {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  }

  function formatDisplayDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  const todayStr = getYYYYMMDD(new Date());

  // ---------------------- EXPORT EXCEL ---------------------------
  const downloadExcel = () => {
    if (!entries.length) return toast.warning('No data to export');

    const wsData = [
      ['Date', 'Project', 'Title', 'Hours', 'Status'],
      ...entries.map((e) => [
        e.t_created_at?.slice(0, 10),
        e.project_name,
        e.title,
        e.n_hrs_spent + 'h',
        e.s_status_name,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Timesheet');
    XLSX.writeFile(wb, `Timesheet_${user?.fullName || 'User'}.xlsx`);

    toast.success('Excel exported');
  };

  // ---------------------- EXPORT PDF ---------------------------
  const downloadPDF = () => {
    if (!entries.length) return toast.warning('No data to export');

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Employee Timesheet Report', 14, 16);

    doc.setFontSize(10);
    doc.text(`Generated for: ${user?.fullName}`, 14, 24);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = entries.map((e) => [
      e.t_created_at.slice(0, 10),
      e.project_name,
      e.title,
      e.n_hrs_spent + 'h',
      e.s_status_name,
    ]);

    autoTable(doc, {
      startY: 36,
      head: [['Date', 'Project', 'Title', 'Hours', 'Status']],
      body: tableData,
    });

    doc.save(`Timesheet_${user?.fullName || 'User'}.pdf`);
    toast.success('PDF exported');
  };

  // ---------------------- FETCH DATA ---------------------------
  useEffect(() => {
    if (!userId) return;
    fetchProjects();
    fetchTimesheetEntries();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get(`pm/getProjectByUser/${userId}`);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Error fetching projects');
    }
  };

  const fetchTimesheetEntries = async () => {
    try {
      const res = await axiosInstance.get(`pm/getUserTimesheet/${userId}`);
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Error fetching timesheet');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- COMPUTED VALUES ---------------------------
  const todaysEntries = useMemo(() => entries.filter((e) => e.t_created_at?.slice(0, 10) === todayStr), [entries]);

  const totalHoursToday = todaysEntries.reduce((acc, e) => acc + Number(e.n_hrs_spent || 0), 0);

  const past7days = useMemo(() => {
    const today = new Date(todayStr);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    return entries.filter((e) => {
      const d = new Date(e.t_created_at);
      return d >= sevenDaysAgo && d <= today;
    });
  }, [entries]);

  // ---------------------- SAVE ENTRY ---------------------------
  const handleSaveEntry = async () => {
    if (!formProjectId) return toast.warning('Select a project');
    if (!formTitle.trim()) return toast.warning('Enter task title');

    const hrs = Number(formHours);
    if (!hrs) return toast.warning('Hours must be > 0');

    setSaving(true);

    try {
      const payload = {
        emp_id: Number(userId),
        project_id: Number(formProjectId),
        timesheet_title: formTitle,
        timesheet_description: formDescription || null,
        hrs_spent: hrs,
      };

      await axiosInstance.post('pm/addTimesheetEntry', payload);
      toast.success('Entry added');

      setShowAddDialog(false);
      fetchTimesheetEntries();

      setFormProjectId('');
      setFormTitle('');
      setFormHours('');
      setFormDescription('');
    } catch {
      toast.error('Failed to add entry');
    } finally {
      setSaving(false);
    }
  };

  // ---------------------- STATUS BADGE ---------------------------
  const StatusBadge = ({ status }) => {
    const s = String(status).toLowerCase();
    const map = {
      submitted: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    const cls = map[s] || 'bg-gray-100 text-gray-700';

    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>;
  };

  // ---------------------- UI ---------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6 px-2">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-indigo-600" />
              Employee Timesheet
            </h1>
            <p className="text-sm text-gray-500">Track your daily work contributions</p>
          </div>

          {/* EXPORT BUTTONS */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={downloadPDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" /> PDF
            </Button>

            <Button variant="outline" onClick={downloadExcel} className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </Button>
          </div>
        </div>

        {/* TODAY SUMMARY CARD — unchanged size */}
        <Card className="p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">Today's Entries</div>
              <div className="text-xs text-gray-400">{formatDisplayDate(todayStr)}</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Total Hours</div>
              <div className="text-2xl font-semibold text-indigo-600">{totalHoursToday}h</div>
            </div>
          </div>

          <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Entry
          </Button>
        </Card>

        {/* TODAY TABLE */}
        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Today’s Timesheet</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-600 bg-gray-50">
                  <th className="p-3">Project</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Hours</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {todaysEntries.map((e) => (
                  <tr key={e.n_timesheet_id} className="border-b">
                    <td className="p-3">{e.project_name}</td>
                    <td className="p-3">{e.title}</td>
                    <td className="p-3">{e.n_hrs_spent}h</td>
                    <td className="p-3">
                      <StatusBadge status={e.s_status_name} />
                    </td>
                    <td className="p-3">{new Date(e.t_created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* PAST 7 DAYS */}
        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Past 7 Days</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-600 bg-gray-50">
                  <th className="p-3">Date</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Hours</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...past7days]
                  .sort((a, b) => new Date(b.t_created_at) - new Date(a.t_created_at))
                  .map((e) => (
                    <tr key={e.n_timesheet_id} className="border-b">
                      <td className="p-3">{formatDisplayDate(e.t_created_at.slice(0, 10))}</td>
                      <td className="p-3">{e.project_name}</td>
                      <td className="p-3">{e.title}</td>
                      <td className="p-3">{e.n_hrs_spent}h</td>
                      <td className="p-3">
                        <StatusBadge status={e.s_status_name} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ADD ENTRY DIALOG */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[600px] rounded-xl">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle>Add Timesheet Entry</DialogTitle>
              <button onClick={() => setShowAddDialog(false)}>
                <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </button>
            </DialogHeader>

            <div className="p-4 space-y-4">
              <div>
                <Label>Date</Label>
                <Input value={formDate} disabled />
              </div>

              <div>
                <Label>Project</Label>
                <select
                  value={formProjectId}
                  onChange={(e) => setFormProjectId(e.target.value)}
                  className="w-full border rounded p-2"
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
                <Label>Task Title</Label>
                <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
              </div>

              <div>
                <Label>Hours</Label>
                <Input type="number" value={formHours} onChange={(e) => setFormHours(e.target.value)} min="1" />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>

              <Button
                className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                onClick={handleSaveEntry}
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Save Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
