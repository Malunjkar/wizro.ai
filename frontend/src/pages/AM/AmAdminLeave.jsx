import { Filter, Loader2, ArrowUpDown, ClipboardCheck } from 'lucide-react';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/lib/axiosConfig';

export default function AmAdminLeave() {
  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState('all');

  const [sortOrder, setSortOrder] = useState('desc');

  const [searchTerm, setSearchTerm] = useState('');

  const fetchAdminLeaves = async () => {
    try {
      const res = await axiosInstance.get('am/adminLeavePage');

      setLeaves(res.data || []);
    } catch {
      toast.error('Failed to load leave applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminLeaves();
  }, []);

  const handleAction = async (leave_id, actionType) => {
    const statusId = actionType === 'approve' ? 7 : 8;

    const payload = { statusId, leaveId: leave_id };

    try {
      await axiosInstance.post('am/updateLeave', payload);

      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave.leave_id === leave_id ? { ...leave, status_name: statusId === 7 ? 'Approved' : 'Rejected' } : leave,
        ),
      );

      toast.success(`Leave ${actionType}d successfully`);
    } catch {
      toast.error('Failed to update leave status');
    }
  };

  const filteredAndSortedLeaves = leaves
    .filter((leave) => {
      const status = leave.status_name ? leave.status_name.toLowerCase() : 'pending';

      const matchesStatus = filterStatus === 'all' || status === filterStatus.toLowerCase();

      const matchesSearch =
        leave.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leave_type.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    })
    .sort((first, second) => {
      const dateA = new Date(first.applied_on);

      const dateB = new Date(second.applied_on);

      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    
  const getStatusBadge = (status) => {
    const statusBadge = status ? status.toLowerCase() : 'pending';

    switch (statusBadge) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-700 rounded-xl">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Leave Approval Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and review employee leave applications — approve or reject requests with ease.
            </p>
          </div>
        </div>

        {/* Filter + Sorting Controls */}
        <Card className="border-border">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 rounded-lg border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort by Date ({sortOrder === 'asc' ? '↑' : '↓'})
              </Button>
            </div>

            <Input
              type="text"
              placeholder="Search by employee or leave type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
          </CardHeader>
        </Card>

        {/* Leave Records */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Leave Applications</CardTitle>
            <CardDescription>All employee leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
              </div>
            ) : filteredAndSortedLeaves.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No leave requests found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-muted text-foreground">
                    <tr>
                      <th className="text-left px-4 py-2">Employee</th>
                      <th className="text-left px-4 py-2">Leave Type</th>
                      <th className="text-left px-4 py-2">Reason</th>
                      <th className="text-left px-4 py-2">Duration</th>
                      <th className="text-left px-4 py-2">Applied On</th>
                      <th className="text-left px-4 py-2">Status</th>
                      <th className="text-center px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedLeaves.map((leave, index) => (
                      <tr key={index} className="border-t border-border hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium">{leave.emp_name}</td>
                        <td className="px-4 py-3">{leave.leave_type}</td>
                        <td className="px-4 py-3">{leave.reason}</td>
                        <td className="px-4 py-3">
                          {leave.start_date} → {leave.end_date}
                        </td>
                        <td className="px-4 py-3">{leave.applied_on}</td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusBadge(leave.status_name)}>{leave.status_name}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {leave.status_name === 'Pending' ? (
                            <div className="flex gap-2 justify-center">
                              <Button
                                variant="outline"
                                className="border-green-600 text-green-600 hover:bg-green-50"
                                onClick={() => handleAction(leave.leave_id, 'approve')}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                                onClick={() => handleAction(leave.leave_id, 'reject')}
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-xs italic">No Action</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
