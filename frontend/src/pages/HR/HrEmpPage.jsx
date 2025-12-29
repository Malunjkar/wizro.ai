import { User, Check, X, AlertCircle, Search, Eye } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const HrEmpPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const [filterDepartment, setFilterDepartment] = useState('all');

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedLeave, setSelectedLeave] = useState(null);

  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const [showActionDialog, setShowActionDialog] = useState(false);

  const [actionType, setActionType] = useState('');

  const [actionReason, setActionReason] = useState('');

  // Leave requests data
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Sarah Johnson',
      department: 'Engineering',
      designation: 'Senior Developer',
      leaveType: 'Casual Leave',
      startDate: '2025-10-15',
      endDate: '2025-10-17',
      days: 3,
      reason: 'Family function to attend',
      status: 'pending',
      appliedOn: '2025-10-05',
      remainingLeaves: { casual: 8, sick: 10, earned: 15 },
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Michael Chen',
      department: 'Marketing',
      designation: 'Marketing Manager',
      leaveType: 'Sick Leave',
      startDate: '2025-10-08',
      endDate: '2025-10-08',
      days: 1,
      reason: 'Severe headache and fever',
      status: 'pending',
      appliedOn: '2025-10-07',
      remainingLeaves: { casual: 10, sick: 11, earned: 18 },
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Emily Davis',
      department: 'HR',
      designation: 'HR Executive',
      leaveType: 'Earned Leave',
      startDate: '2025-10-20',
      endDate: '2025-10-27',
      days: 8,
      reason: 'Planned vacation with family',
      status: 'approved',
      appliedOn: '2025-09-28',
      approvedBy: 'HR Manager',
      approvedOn: '2025-09-29',
      remainingLeaves: { casual: 12, sick: 12, earned: 10 },
    },
    {
      id: 4,
      employeeId: 'EMP004',
      employeeName: 'James Wilson',
      department: 'Engineering',
      designation: 'QA Engineer',
      leaveType: 'Work From Home',
      startDate: '2025-10-10',
      endDate: '2025-10-10',
      days: 1,
      reason: 'Internet installation at home',
      status: 'rejected',
      appliedOn: '2025-10-08',
      rejectedBy: 'HR Manager',
      rejectedOn: '2025-10-08',
      rejectionReason: 'Client demo scheduled, presence required',
      remainingLeaves: { casual: 9, sick: 12, earned: 16 },
    },
    {
      id: 5,
      employeeId: 'EMP005',
      employeeName: 'Priya Sharma',
      department: 'Finance',
      designation: 'Accountant',
      leaveType: 'Casual Leave',
      startDate: '2025-10-12',
      endDate: '2025-10-13',
      days: 2,
      reason: 'Personal work',
      status: 'pending',
      appliedOn: '2025-10-06',
      remainingLeaves: { casual: 7, sick: 11, earned: 14 },
    },
  ]);

  // Statistics
  const stats = {
    pending: leaveRequests.filter((leave) => leave.status === 'pending').length,
    approved: leaveRequests.filter((leave) => leave.status === 'approved').length,
    rejected: leaveRequests.filter((leave) => leave.status === 'rejected').length,
    total: leaveRequests.length,
  };

  const departments = ['all', 'Engineering', 'Marketing', 'HR', 'Finance', 'Sales'];

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setShowDetailsDialog(true);
  };

  const handleActionClick = (leave, action) => {
    setSelectedLeave(leave);
    setActionType(action);
    setActionReason('');
    setShowDetailsDialog(false);
    setShowActionDialog(true);
  };

  const handleConfirmAction = () => {
    if (actionType === 'reject' && !actionReason) {
      return;
    }

    const updatedRequests = leaveRequests.map((leave) => {
      if (leave.id === selectedLeave.id) {
        if (actionType === 'approve') {
          return {
            ...leave,
            status: 'approved',
            approvedBy: 'HR Manager',
            approvedOn: new Date().toISOString().split('T')[0],
          };
        } else {
          return {
            ...leave,
            status: 'rejected',
            rejectedBy: 'HR Manager',
            rejectedOn: new Date().toISOString().split('T')[0],
            rejectionReason: actionReason,
          };
        }
      }

      return leave;
    });

    setLeaveRequests(updatedRequests);
    setShowActionDialog(false);
    setActionReason('');
    setSelectedLeave(null);
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-500/10 text-green-600 border-green-200',
      pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
      rejected: 'bg-red-500/10 text-red-600 border-red-200',
    };

    return styles[status] || '';
  };

  // Filter logic
  const filteredRequests = leaveRequests.filter((leave) => {
    const matchesStatus = filterStatus === 'all' || leave.status === filterStatus;

    const matchesDepartment = filterDepartment === 'all' || leave.department === filterDepartment;

    const matchesSearch =
      leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDepartment && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Leave Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and manage employee leave requests</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-500/5">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-green-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-500/5">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-red-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name or employee ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Department Filter */}
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>
              {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
              {filteredRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No leave requests found</p>
              ) : (
                filteredRequests.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-4 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        {/* Employee Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{leave.employeeName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {leave.employeeId} • {leave.designation} • {leave.department}
                            </p>
                          </div>
                          <Badge className={getStatusBadge(leave.status)}>
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </Badge>
                        </div>

                        {/* Leave Details */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Leave Type</p>
                            <p className="font-medium text-foreground">{leave.leaveType}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p className="font-medium text-foreground">
                              {new Date(leave.startDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">End Date</p>
                            <p className="font-medium text-foreground">
                              {new Date(leave.endDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium text-foreground">
                              {leave.days} {leave.days === 1 ? 'day' : 'days'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Applied On</p>
                            <p className="font-medium text-foreground">
                              {new Date(leave.appliedOn).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(leave)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {leave.status === 'pending' && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleActionClick(leave, 'approve')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleActionClick(leave, 'reject')}>
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
              <DialogDescription>Complete information about the leave request</DialogDescription>
            </DialogHeader>

            {selectedLeave && (
              <div className="space-y-4 py-4">
                {/* Employee Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Employee Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium text-foreground">{selectedLeave.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Employee ID</p>
                      <p className="font-medium text-foreground">{selectedLeave.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium text-foreground">{selectedLeave.department}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Designation</p>
                      <p className="font-medium text-foreground">{selectedLeave.designation}</p>
                    </div>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Leave Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Leave Type</p>
                      <p className="font-medium text-foreground">{selectedLeave.leaveType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground">
                        {selectedLeave.days} {selectedLeave.days === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(selectedLeave.startDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(selectedLeave.endDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Reason</h4>
                  <p className="text-sm text-foreground bg-muted p-3 rounded-lg">{selectedLeave.reason}</p>
                </div>

                {/* Leave Balance */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Remaining Leave Balance</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Casual</p>
                      <p className="text-lg font-semibold text-foreground">{selectedLeave.remainingLeaves.casual}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Sick</p>
                      <p className="text-lg font-semibold text-foreground">{selectedLeave.remainingLeaves.sick}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Earned</p>
                      <p className="text-lg font-semibold text-foreground">{selectedLeave.remainingLeaves.earned}</p>
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                {selectedLeave.status === 'approved' && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-500/10 p-3 rounded-lg">
                    <Check className="w-4 h-4" />
                    <span>
                      Approved by {selectedLeave.approvedBy} on{' '}
                      {new Date(selectedLeave.approvedOn).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                {selectedLeave.status === 'rejected' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-500/10 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Rejected by {selectedLeave.rejectedBy} on{' '}
                        {new Date(selectedLeave.rejectedOn).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Rejection Reason</p>
                      <p className="text-sm text-foreground">{selectedLeave.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              {selectedLeave && selectedLeave.status === 'pending' && (
                <>
                  <Button
                    variant="default"
                    onClick={() => handleActionClick(selectedLeave, 'approve')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="destructive" onClick={() => handleActionClick(selectedLeave, 'reject')}>
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Confirmation Dialog */}
        <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}</DialogTitle>
              <DialogDescription>
                {actionType === 'approve'
                  ? 'Are you sure you want to approve this leave request?'
                  : 'Please provide a reason for rejecting this leave request'}
              </DialogDescription>
            </DialogHeader>

            {selectedLeave && (
              <div className="space-y-4 py-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">Employee</p>
                  <p className="font-semibold text-foreground">{selectedLeave.employeeName}</p>
                  <p className="text-sm text-muted-foreground mt-2">Leave Period</p>
                  <p className="text-sm text-foreground">
                    {new Date(selectedLeave.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    -{' '}
                    {new Date(selectedLeave.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    ({selectedLeave.days} {selectedLeave.days === 1 ? 'day' : 'days'})
                  </p>
                </div>

                {actionType === 'reject' && (
                  <div className="space-y-2">
                    <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                    <Textarea
                      id="rejection-reason"
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Enter reason for rejection..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowActionDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAction}
                disabled={actionType === 'reject' && !actionReason}
                className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                variant={actionType === 'approve' ? 'default' : 'destructive'}
              >
                {actionType === 'approve' ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Approval
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Confirm Rejection
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HrEmpPage;
