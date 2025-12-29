import {
  Briefcase,
  Plus,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  AlertCircle,
} from 'lucide-react';
import React, { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const HrPerformancePage = () => {
  const [activeTab, setActiveTab] = useState('positions');

  const [searchQuery, setSearchQuery] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterDepartment, setFilterDepartment] = useState('all');

  const [showPositionDialog, setShowPositionDialog] = useState(false);

  const [showCandidateDialog, setShowCandidateDialog] = useState(false);

  const [showActionDialog, setShowActionDialog] = useState(false);

  const [selectedPosition, setSelectedPosition] = useState(null);

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [actionType, setActionType] = useState('');

  const [actionNotes, setActionNotes] = useState('');

  // Job Positions Data
  const [jobPositions, _setJobPositions] = useState([
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Mumbai',
      type: 'Full-time',
      experience: '5-7 years',
      openings: 3,
      postedDate: '2025-09-15',
      status: 'active',
      applicants: 45,
      description: 'We are looking for an experienced software engineer to join our team.',
      requirements: ['5+ years of experience', 'Strong in React and Node.js', 'Team leadership skills'],
    },
    {
      id: 2,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '3-5 years',
      openings: 1,
      postedDate: '2025-09-20',
      status: 'active',
      applicants: 28,
      description: 'Lead our marketing initiatives and grow our brand presence.',
      requirements: ['3+ years in marketing', 'Digital marketing expertise', 'Leadership experience'],
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      experience: '2-4 years',
      openings: 2,
      postedDate: '2025-09-25',
      status: 'active',
      applicants: 62,
      description: 'Create beautiful and intuitive user experiences.',
      requirements: ['Strong portfolio', 'Figma expertise', 'User research skills'],
    },
    {
      id: 4,
      title: 'HR Executive',
      department: 'Human Resources',
      location: 'Mumbai',
      type: 'Full-time',
      experience: '1-3 years',
      openings: 1,
      postedDate: '2025-08-10',
      status: 'closed',
      applicants: 35,
      description: 'Handle recruitment and employee relations.',
      requirements: ['HR experience', 'Good communication', 'HRIS knowledge'],
    },
  ]);

  // Candidates Data
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210',
      position: 'Senior Software Engineer',
      positionId: 1,
      experience: '6 years',
      currentCompany: 'Tech Corp',
      expectedSalary: '₹25 LPA',
      noticePeriod: '60 days',
      appliedDate: '2025-09-18',
      status: 'interview',
      stage: 'Technical Round',
      resumeUrl: '#',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      education: 'B.Tech in Computer Science',
      location: 'Mumbai',
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 98765 43211',
      position: 'Marketing Manager',
      positionId: 2,
      experience: '4 years',
      currentCompany: 'Brand Solutions',
      expectedSalary: '₹18 LPA',
      noticePeriod: '30 days',
      appliedDate: '2025-09-22',
      status: 'shortlisted',
      stage: 'Profile Review',
      resumeUrl: '#',
      skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
      education: 'MBA in Marketing',
      location: 'Bangalore',
    },
    {
      id: 3,
      name: 'Arjun Mehta',
      email: 'arjun.mehta@email.com',
      phone: '+91 98765 43212',
      position: 'UI/UX Designer',
      positionId: 3,
      experience: '3 years',
      currentCompany: 'Design Studio',
      expectedSalary: '₹15 LPA',
      noticePeriod: '45 days',
      appliedDate: '2025-09-26',
      status: 'new',
      stage: 'Application Received',
      resumeUrl: '#',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      education: 'B.Des in Product Design',
      location: 'Remote',
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@email.com',
      phone: '+91 98765 43213',
      position: 'Senior Software Engineer',
      positionId: 1,
      experience: '7 years',
      currentCompany: 'Software Inc',
      expectedSalary: '₹28 LPA',
      noticePeriod: '90 days',
      appliedDate: '2025-09-20',
      status: 'offer',
      stage: 'Offer Extended',
      resumeUrl: '#',
      skills: ['React', 'Python', 'Docker', 'Kubernetes'],
      education: 'M.Tech in Computer Science',
      location: 'Mumbai',
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      phone: '+91 98765 43214',
      position: 'Marketing Manager',
      positionId: 2,
      experience: '3 years',
      currentCompany: 'Marketing Hub',
      expectedSalary: '₹16 LPA',
      noticePeriod: '30 days',
      appliedDate: '2025-09-24',
      status: 'rejected',
      stage: 'Not Suitable',
      resumeUrl: '#',
      skills: ['Social Media', 'Branding', 'Campaign Management'],
      education: 'BBA in Marketing',
      location: 'Delhi',
      rejectionReason: 'Experience not aligned with requirements',
    },
  ]);

  const departments = ['all', 'Engineering', 'Marketing', 'Design', 'Human Resources', 'Finance'];

  const positionStatuses = ['all', 'active', 'closed'];

  const candidateStatuses = ['all', 'new', 'shortlisted', 'interview', 'offer', 'rejected'];

  // Statistics
  const positionStats = {
    total: jobPositions.length,
    active: jobPositions.filter((job) => job.status === 'active').length,
    totalOpenings: jobPositions.filter((job) => job.status === 'active').reduce((sum, job) => sum + job.openings, 0),
    totalApplicants: jobPositions.reduce((sum, job) => sum + job.applicants, 0),
  };

  const candidateStats = {
    total: candidates.length,
    new: candidates.filter((candidate) => candidate.status === 'new').length,
    interview: candidates.filter((candidate) => candidate.status === 'interview').length,
    offer: candidates.filter((candidate) => candidate.status === 'offer').length,
  };

  const handleViewPosition = (position) => {
    setSelectedPosition(position);
    setShowPositionDialog(true);
  };

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateDialog(true);
  };

  const handleCandidateAction = (candidate, action) => {
    setSelectedCandidate(candidate);
    setActionType(action);
    setActionNotes('');
    setShowCandidateDialog(false);
    setShowActionDialog(true);
  };

  const confirmCandidateAction = () => {
    const updatedCandidates = candidates.map((candidate) => {
      if (candidate.id === selectedCandidate.id) {
        let newStatus = candidate.status;
        let newStage = candidate.stage;

        switch (actionType) {
          case 'shortlist':
            newStatus = 'shortlisted';
            newStage = 'Profile Review';
            break;
          case 'interview':
            newStatus = 'interview';
            newStage = 'Technical Round';
            break;
          case 'offer':
            newStatus = 'offer';
            newStage = 'Offer Extended';
            break;
          case 'reject':
            newStatus = 'rejected';
            newStage = 'Not Suitable';
            break;
          default:
            break;
        }

        return { ...candidate, status: newStatus, stage: newStage };
      }

      return candidate;
    });

    setCandidates(updatedCandidates);
    setShowActionDialog(false);
    setActionNotes('');
    setSelectedCandidate(null);
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'default',
      closed: 'secondary',
      new: 'secondary',
      shortlisted: 'default',
      interview: 'default',
      offer: 'default',
      rejected: 'destructive',
    };

    return variants[status] || 'secondary';
  };

  // Filter logic
  const filteredPositions = jobPositions.filter((pos) => {
    const matchesStatus = filterStatus === 'all' || pos.status === filterStatus;

    const matchesDepartment = filterDepartment === 'all' || pos.department === filterDepartment;

    const matchesSearch = pos.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDepartment && matchesSearch;
  });

  const filteredCandidates = candidates.filter((can) => {
    const matchesStatus = filterStatus === 'all' || can.status === filterStatus;

    const matchesDepartment =
      filterDepartment === 'all' ||
      jobPositions.find((job) => job.id === can.positionId)?.department === filterDepartment;

    const matchesSearch =
      can.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      can.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDepartment && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Recruitment</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage job positions and candidate applications</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="positions">Job Positions</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>

          {/* Job Positions Tab */}
          <TabsContent value="positions" className="space-y-6 mt-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Positions</CardDescription>
                  <CardTitle className="text-3xl">{positionStats.total}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Active Positions</CardDescription>
                  <CardTitle className="text-3xl text-green-600">{positionStats.active}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Open Vacancies</CardDescription>
                  <CardTitle className="text-3xl text-blue-600">{positionStats.totalOpenings}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Applicants</CardDescription>
                  <CardTitle className="text-3xl text-purple-600">{positionStats.totalApplicants}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search positions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {positionStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Department" />
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

            {/* Positions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPositions.length === 0 ? (
                <Card className="col-span-2">
                  <CardContent className="py-8 text-center text-muted-foreground">No positions found</CardContent>
                </Card>
              ) : (
                filteredPositions.map((position) => (
                  <Card key={position.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{position.title}</CardTitle>
                          <CardDescription>{position.department}</CardDescription>
                        </div>
                        <Badge variant={getStatusBadge(position.status)}>
                          {position.status === 'active' ? 'Active' : 'Closed'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          <span>{position.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{position.experience}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{position.applicants} applicants</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Openings: </span>
                          <span className="font-semibold">{position.openings}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewPosition(position)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6 mt-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Candidates</CardDescription>
                  <CardTitle className="text-3xl">{candidateStats.total}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>New Applications</CardDescription>
                  <CardTitle className="text-3xl text-blue-600">{candidateStats.new}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>In Interview</CardDescription>
                  <CardTitle className="text-3xl text-yellow-600">{candidateStats.interview}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Offers Extended</CardDescription>
                  <CardTitle className="text-3xl text-green-600">{candidateStats.offer}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search candidates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidateStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Department" />
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

            {/* Candidates Table */}
            <Card>
              <CardHeader>
                <CardTitle>Candidate Applications</CardTitle>
                <CardDescription>
                  {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No candidates found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCandidates.map((candidate) => (
                          <TableRow key={candidate.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{candidate.name}</p>
                                  <p className="text-sm text-muted-foreground">{candidate.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{candidate.position}</p>
                              <p className="text-sm text-muted-foreground">{candidate.location}</p>
                            </TableCell>
                            <TableCell>{candidate.experience}</TableCell>
                            <TableCell>
                              {new Date(candidate.appliedDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadge(candidate.status)}>
                                {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewCandidate(candidate)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {candidate.status !== 'rejected' && candidate.status !== 'offer' && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                      handleCandidateAction(
                                        candidate,
                                        candidate.status === 'new'
                                          ? 'shortlist'
                                          : candidate.status === 'shortlisted'
                                            ? 'interview'
                                            : 'offer',
                                      )
                                    }
                                  >
                                    {candidate.status === 'new'
                                      ? 'Shortlist'
                                      : candidate.status === 'shortlisted'
                                        ? 'Interview'
                                        : 'Offer'}
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Position Details Dialog */}
        <Dialog open={showPositionDialog} onOpenChange={setShowPositionDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedPosition?.title}</DialogTitle>
              <DialogDescription>
                {selectedPosition?.department} • {selectedPosition?.location}
              </DialogDescription>
            </DialogHeader>

            {selectedPosition && (
              <div className="space-y-4 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Position Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Job Type</Label>
                        <p className="font-medium">{selectedPosition.type}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Experience Required</Label>
                        <p className="font-medium">{selectedPosition.experience}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Openings</Label>
                        <p className="font-medium">{selectedPosition.openings}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Applicants</Label>
                        <p className="font-medium">{selectedPosition.applicants}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Posted Date</Label>
                        <p className="font-medium">
                          {new Date(selectedPosition.postedDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <Badge variant={getStatusBadge(selectedPosition.status)} className="mt-1">
                          {selectedPosition.status === 'active' ? 'Active' : 'Closed'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground">{selectedPosition.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPosition.requirements.map((req, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPositionDialog(false)}>
                Close
              </Button>
              <Button>Edit Position</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Candidate Details Dialog */}
        <Dialog open={showCandidateDialog} onOpenChange={setShowCandidateDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCandidate?.name}</DialogTitle>
              <DialogDescription>Application for {selectedCandidate?.position}</DialogDescription>
            </DialogHeader>

            {selectedCandidate && (
              <div className="space-y-4 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCandidate.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCandidate.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCandidate.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Experience</Label>
                        <p className="font-medium">{selectedCandidate.experience}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Current Company</Label>
                        <p className="font-medium">{selectedCandidate.currentCompany}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Expected Salary</Label>
                        <p className="font-medium">{selectedCandidate.expectedSalary}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Notice Period</Label>
                        <p className="font-medium">{selectedCandidate.noticePeriod}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Education</Label>
                        <p className="font-medium">{selectedCandidate.education}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Applied Date</Label>
                        <p className="font-medium">
                          {new Date(selectedCandidate.appliedDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Application Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant={getStatusBadge(selectedCandidate.status)} className="mb-2">
                          {selectedCandidate.status.charAt(0).toUpperCase() + selectedCandidate.status.slice(1)}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{selectedCandidate.stage}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {selectedCandidate.status === 'rejected' && selectedCandidate.rejectionReason && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Rejection Reason:</strong> {selectedCandidate.rejectionReason}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCandidateDialog(false)}>
                Close
              </Button>
              {selectedCandidate && selectedCandidate.status !== 'rejected' && selectedCandidate.status !== 'offer' && (
                <>
                  <Button variant="destructive" onClick={() => handleCandidateAction(selectedCandidate, 'reject')}>
                    Reject
                  </Button>
                  <Button
                    onClick={() =>
                      handleCandidateAction(
                        selectedCandidate,
                        selectedCandidate.status === 'new'
                          ? 'shortlist'
                          : selectedCandidate.status === 'shortlisted'
                            ? 'interview'
                            : 'offer',
                      )
                    }
                  >
                    {selectedCandidate.status === 'new'
                      ? 'Shortlist'
                      : selectedCandidate.status === 'shortlisted'
                        ? 'Schedule Interview'
                        : 'Extend Offer'}
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
              <DialogTitle>
                {actionType === 'shortlist' && 'Shortlist Candidate'}
                {actionType === 'interview' && 'Schedule Interview'}
                {actionType === 'offer' && 'Extend Offer'}
                {actionType === 'reject' && 'Reject Application'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'reject'
                  ? 'Please provide a reason for rejection'
                  : `Confirm action for ${selectedCandidate?.name}`}
              </DialogDescription>
            </DialogHeader>

            {selectedCandidate && (
              <div className="space-y-4 py-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-muted-foreground">Candidate</Label>
                        <p className="font-semibold text-lg">{selectedCandidate.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Position</Label>
                        <p className="font-medium">{selectedCandidate.position}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Current Stage</Label>
                        <Badge variant={getStatusBadge(selectedCandidate.status)} className="mt-1">
                          {selectedCandidate.stage}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {actionType === 'reject' && (
                  <div className="space-y-2">
                    <Label htmlFor="rejection-notes">Rejection Reason *</Label>
                    <Textarea
                      id="rejection-notes"
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Enter reason for rejection..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                )}

                {actionType !== 'reject' && (
                  <div className="space-y-2">
                    <Label htmlFor="action-notes">Notes (Optional)</Label>
                    <Textarea
                      id="action-notes"
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Add any additional notes..."
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
                onClick={confirmCandidateAction}
                disabled={actionType === 'reject' && !actionNotes}
                variant={actionType === 'reject' ? 'destructive' : 'default'}
              >
                {actionType === 'shortlist' && <CheckCircle className="w-4 h-4 mr-2" />}
                {actionType === 'interview' && <Calendar className="w-4 h-4 mr-2" />}
                {actionType === 'offer' && <CheckCircle className="w-4 h-4 mr-2" />}
                {actionType === 'reject' && <XCircle className="w-4 h-4 mr-2" />}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HrPerformancePage;
