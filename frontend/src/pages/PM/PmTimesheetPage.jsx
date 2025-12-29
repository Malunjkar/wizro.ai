import React, { useEffect, useMemo, useState } from 'react';
import { Download, FileSpreadsheet, Calendar, CheckCircle, XCircle, Search } from 'lucide-react';

import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosConfig';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function PmTimesheetPage() {
  const [entries, setEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedEmp, setSelectedEmp] = useState('all');
  const [range, setRange] = useState('all');

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get('pm/getEmp');
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load employees');
    }
  };

  // Fetch all timesheet data
  const fetchTimesheet = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('pm/getTimesheet');
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load timesheet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTimesheet();
  }, []);

  // -------------------------------
  // FILTERED LIST COMPUTING
  // -------------------------------
  const filtered = useMemo(() => {
    const today = new Date();
    const dateLimit7 = new Date();
    dateLimit7.setDate(today.getDate() - 7);
    const dateLimit30 = new Date();
    dateLimit30.setDate(today.getDate() - 30);

    return entries
      .filter((e) => {
        // Employee filter
        if (selectedEmp !== 'all' && Number(selectedEmp) !== e.n_emp_id) return false;

        // Search filter
        if (
          search.trim() &&
          !(
            e.title?.toLowerCase().includes(search.toLowerCase()) ||
            e.emp_name?.toLowerCase().includes(search.toLowerCase())
          )
        )
          return false;

        // Date range filter
        const dateCreated = new Date(e.t_created_at);

        if (range === '7' && !(dateCreated >= dateLimit7)) return false;
        if (range === '30' && !(dateCreated >= dateLimit30)) return false;

        return true;
      })
      .sort((a, b) => new Date(b.t_created_at) - new Date(a.t_created_at));
  }, [entries, selectedEmp, search, range]);

  // -------------------------------
  // PAGINATION
  // -------------------------------
  const pageCount = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // -------------------------------
  // STATUS BADGE
  // -------------------------------
  const StatusBadge = ({ status }) => {
    const s = String(status).toLowerCase();
    const style =
      s === 'approved'
        ? 'bg-green-100 text-green-700'
        : s === 'rejected'
          ? 'bg-red-100 text-red-700'
          : 'bg-blue-100 text-blue-700';

    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style}`}>{status}</span>;
  };

  // APPROVE / REJECT
  const updateStatus = async (id, statusId) => {
    try {
      await axiosInstance.post(`pm/updateTimesheetStatus/${id}`, { statusId });
      toast.success('Status updated');
      fetchTimesheet();
    } catch {
      toast.error('Status update failed');
    }
  };

  // EXPORT FUNCTIONS
  const generateEmployeeData = () => {
    if (selectedEmp === 'all') {
      toast.warning('Select an employee first');
      return [];
    }
    return filtered.filter((e) => e.n_emp_id === Number(selectedEmp));
  };

  const downloadExcel = () => {
    const data = generateEmployeeData();
    if (!data.length) return toast.warning('No data to export');

    const wsData = [
      ['Date', 'Project', 'Title', 'Hours', 'Status'],
      ...data.map((e) => [e.t_created_at.slice(0, 10), e.project_name, e.title, e.n_hrs_spent + 'h', e.s_status_name]),
    ];

    const sheet = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Timesheet');

    XLSX.writeFile(wb, `Timesheet_${selectedEmp}.xlsx`);
    toast.success('Excel downloaded');
  };

  const downloadPDF = () => {
    const data = generateEmployeeData();
    if (!data.length) return toast.warning('No data to export');

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Employee Timesheet Report', 14, 16);

    autoTable(doc, {
      startY: 24,
      head: [['Date', 'Project', 'Title', 'Hours', 'Status']],
      body: data.map((e) => [
        e.t_created_at.slice(0, 10),
        e.project_name,
        e.title,
        e.n_hrs_spent + 'h',
        e.s_status_name,
      ]),
    });

    doc.save(`Timesheet_${selectedEmp}.pdf`);
    toast.success('PDF downloaded');
  };

  // UI RETURN
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
              <Calendar className="w-6 h-6 text-indigo-600" />
              Timesheet Management (Admin)
            </h1>
            <p className="text-sm text-gray-500">View & manage all employee entries</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={downloadPDF}>
              <Download className="w-4 h-4" /> PDF
            </Button>
            <Button variant="outline" onClick={downloadExcel}>
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </Button>
          </div>
        </div>

        {/* FILTERS */}
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Employee</Label>
              <select
                value={selectedEmp}
                onChange={(e) => {
                  setSelectedEmp(e.target.value);
                  setPage(1);
                }}
                className="w-full border rounded p-2"
              >
                <option value="all">All Employees</option>
                {employees.map((e) => (
                  <option key={e.n_user_id} value={e.n_user_id}>
                    {e.s_full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Date Range</Label>
              <select
                value={range}
                onChange={(e) => {
                  setRange(e.target.value);
                  setPage(1);
                }}
                className="w-full border rounded p-2"
              >
                <option value="all">All</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
              </select>
            </div>

            <div className="col-span-2">
              <Label>Search</Label>
              <div className="flex items-center border rounded px-3">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title or employee..."
                  className="border-0 focus-visible:ring-0"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* TABLE */}
        <Card className="p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-600">
                  <th className="p-3">Employee</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Hours</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  paginated.map((t) => (
                    <tr key={t.n_timesheet_id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{t.emp_name}</td>
                      <td className="p-3">{t.project_name}</td>
                      <td className="p-3">{t.title}</td>
                      <td className="p-3">{t.n_hrs_spent}h</td>
                      <td className="p-3">
                        <StatusBadge status={t.s_status_name} />
                      </td>
                      <td className="p-3">{new Date(t.t_created_at).toLocaleDateString()}</td>
                      <td className="p-3 flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-700 hover:bg-green-50 border border-green-300 hover:border-green-400 rounded-md"
                          onClick={() => updateStatus(t.n_timesheet_id, 11)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-700 hover:bg-red-50 border border-red-300 hover:border-red-400 rounded-md"
                          onClick={() => updateStatus(t.n_timesheet_id, 12)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-4">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {pageCount || 1}
            </span>
            <Button size="sm" variant="outline" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
