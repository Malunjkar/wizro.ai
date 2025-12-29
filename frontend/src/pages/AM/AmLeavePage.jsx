import { Plus, Filter, ClipboardList, Calendar, ArrowUpDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axiosConfig';

// Leave icons
const leaveIcons = {
  'Casual Leave': '☕',
  'Sick Leave': '🏥',
  'Paid Leave': '✈️',
  'Unpaid Leave': '❌',
  'Half Day Leave': '⏰',
  'Study Leave': '📚',
};

export default function AmLeavePage() {
  const { user } = useAuth();

  const userId = user?.empID;

  const [showApplyLeave, setShowApplyLeave] = useState(false);

  const [leaveTypes, setLeaveTypes] = useState([]);

  const [selectedLeaveType, setSelectedLeaveType] = useState('');

  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');

  const [reason, setReason] = useState('');

  const [leaveRecords, setLeaveRecords] = useState([]);

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterLeaveType, setFilterLeaveType] = useState('all');

  const [sortOrder, setSortOrder] = useState('desc');

  // Tomorrow's date
  const getTomorrowStr = () => {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();

    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');

    const date = String(tomorrow.getDate()).padStart(2, '0');

    return `${yyyy}-${month}-${date}`;
  };

  const TOMORROW = getTomorrowStr();

  // Fetch leave types
  useEffect(() => {
    axiosInstance
      .get(`am/leaveType`)
      .then((res) => {
        setLeaveTypes(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => toast.error('Error fetching leave types'));
  }, []);

  // Fetch leave records
  const viewLeave = async () => {
    if (!userId) {
      return;
    }
    try {
      const response = await axiosInstance.get(`am/getLeave/${userId}`);

      setLeaveRecords(Array.isArray(response.data) ? response.data : []);
    } catch {
      setLeaveRecords([]);
    }
  };

  useEffect(() => {
    viewLeave();
  }, []);

  // Apply Leave
  const handleApplyLeave = async () => {
    if (!userId || !selectedLeaveType || !startDate || !endDate || !reason) {
      return toast.error('All fields are required');
    }

    const payload = {
      userId,
      leaveType: selectedLeaveType, // send ID
      startDate,
      endDate,
      reason,
    };

    try {
      const res = await axiosInstance.post(`/am/applyLeave`, payload);

      if (res.status === 200) {
        toast.success('Leave Applied Successfully');
        resetForm();
        viewLeave();
      }
    } catch {
      toast.error('Failed to apply leave');
    }

    return null;
  };

  const resetForm = () => {
    setSelectedLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
    setShowApplyLeave(false);
  };

  const getStatusBadge = (status_name) => {
    const statusBadge = status_name ? String(status_name).toLowerCase() : 'pending';

    switch (statusBadge) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const displayLeaveType = (leaveTypeValue) => {
    if (!leaveTypeValue) {
      return 'Unknown';
    }
    const found = leaveTypes.find(
      (ltype) => String(ltype.s_leave_type_name).toLowerCase() === String(leaveTypeValue).toLowerCase(),
    );

    return found ? found.s_leave_type_name : leaveTypeValue;
  };

  // Filtering and sorting
  const filteredLeaves = leaveRecords
    .filter((leave) => {
      const statusName = leave.status_name ? String(leave.status_name).toLowerCase() : 'pending';

      const ltype = leave.leave_type ? String(leave.leave_type).toLowerCase() : 'unknown';

      return (
        (filterStatus === 'all' || statusName === filterStatus) &&
        (filterLeaveType === 'all' || ltype === String(filterLeaveType).toLowerCase())
      );
    })
    .sort((first, second) => {
      const dateA = new Date(second.start_date);

      const dateB = new Date(first.start_date);

      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-600" />
              Leave Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage your leave applications</p>
          </div>
          <Button onClick={() => setShowApplyLeave(true)} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" /> Apply Leave
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-white shadow-sm p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filterLeaveType}
            onChange={(e) => setFilterLeaveType(e.target.value)}
            className="px-3 py-1 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All Leave Types</option>
            {leaveTypes.map((type) => (
              <option key={type.n_leave_type_id} value={type.s_leave_type_name}>
                {type.s_leave_type_name}
              </option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-1 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-400"
            >
              <option value="desc">Latest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Apply Leave Dialog */}
        <Dialog open={showApplyLeave} onOpenChange={setShowApplyLeave}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
              <DialogDescription>Fill the details below to submit your leave application</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* Leave Type Selection */}
              <div className="space-y-3">
                <Label>Leave Type</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {leaveTypes.map((type) => (
                    <button
                      key={type.n_leave_type_id}
                      onClick={() => setSelectedLeaveType(type.n_leave_type_id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedLeaveType === type.n_leave_type_id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-2">{leaveIcons[type.s_leave_type_name] || '🏷️'}</div>
                      <div className="text-xs font-medium text-gray-800 text-center">{type.s_leave_type_name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} min={TOMORROW} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    min={startDate || TOMORROW}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your reason..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleApplyLeave} disabled={!selectedLeaveType || !startDate || !endDate || !reason}>
                Submit Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Leave History */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
              <Calendar className="w-5 h-5 text-blue-600" />
              Leave History
            </CardTitle>
            <CardDescription>View all your leave records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
              {filteredLeaves.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No leave records found</p>
              ) : (
                filteredLeaves.map((leave, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-800">{displayLeaveType(leave.leave_type)}</h3>
                          <Badge className={getStatusBadge(leave.status_name)}>
                            {leave.status_name
                              ? String(leave.status_name).charAt(0).toUpperCase() + String(leave.status_name).slice(1)
                              : 'Pending'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Start Date</p>
                            <p className="font-medium text-gray-800">{leave.start_date || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">End Date</p>
                            <p className="font-medium text-gray-800">{leave.end_date || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Reason</p>
                            <p className="font-medium text-gray-800">{leave.reason || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Status</p>
                            <p className="font-medium text-gray-800">{leave.status_name || 'Pending'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
