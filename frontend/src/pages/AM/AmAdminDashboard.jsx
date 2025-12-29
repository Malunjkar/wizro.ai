import { CheckCircle, XCircle, Clock, Filter, ArrowUpDown, Timer, ClipboardList } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import axiosInstance from '@/lib/axiosConfig';

export default function AmAdminDashboard() {
  const locationColors = {
    office: 'bg-blue-100 text-blue-700',
    client: 'bg-purple-100 text-purple-700',
    wfh: 'bg-green-100 text-green-700',
  };

  const statusColors = {
    Present: 'bg-green-100 text-green-700',
    'Half Day': 'bg-yellow-100 text-yellow-700',
    Absent: 'bg-red-100 text-red-700',
    Late: 'bg-orange-100 text-orange-700',
  };

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [filters, setFilters] = useState({
    work_location: '',
    status_name: '',
    sortBy: '',
    sortOrder: 'asc',
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/am/today`);

      const records = response.data || [];

      setAttendanceRecords(records);
      toast.success('Data fetched successfully');
    } catch {
      toast.error('Error fetching data');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPresent = attendanceRecords.filter(
    (rec) => rec.status_name === 'Present' || rec.status_name === 'Half Day' || rec.status_name === 'Late',
  ).length;

  const totalAbsent = attendanceRecords.filter((rec) => rec.status_name === 'Absent').length;

  const onTime = attendanceRecords.filter((rec) => rec.check_in_time <= '10:30:00').length;

  const totalLate = attendanceRecords.filter((rec) => rec.check_in_time > '10:00:00').length;

  // Filter + Sort logic
  const filteredRecords = useMemo(() => {
    let filtered = [...attendanceRecords];

    if (filters.work_location) {
      filtered = filtered.filter((rec) => rec.work_location?.toLowerCase() === filters.work_location.toLowerCase());
    }

    if (filters.status_name) {
      filtered = filtered.filter((rec) => rec.status_name?.toLowerCase() === filters.status_name.toLowerCase());
    }

    if (filters.sortBy) {
      filtered.sort((first, second) => {
        const valA = first[filters.sortBy] ?? '';

        const valB = second[filters.sortBy] ?? '';

        if (valA < valB) {
          return filters.sortOrder === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return filters.sortOrder === 'asc' ? 1 : -1;
        }

        return 0;
      });
    }

    return filtered;
  }, [attendanceRecords, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div>
      {/* Statistical Cards */}
      <div className="w-full px-6 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-6">
            <div>
              <p className="text-gray-500 text-sm">Total Present</p>
              <p className="text-3xl font-bold text-gray-900">{totalPresent}</p>
            </div>
            <CheckCircle size={28} className="text-blue-500" />
          </div>

          <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-6">
            <div>
              <p className="text-gray-500 text-sm">Total Absent</p>
              <p className="text-3xl font-bold text-gray-900">{totalAbsent}</p>
            </div>
            <XCircle size={28} className="text-red-500" />
          </div>

          <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-6">
            <div>
              <p className="text-gray-500 text-sm">On Time</p>
              <p className="text-3xl font-bold text-gray-900">{onTime}</p>
            </div>
            <Clock size={28} className="text-green-500" />
          </div>

          <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-6">
            <div>
              <p className="text-gray-500 text-sm">Total Late</p>
              <p className="text-3xl font-bold text-gray-900">{totalLate}</p>
            </div>
            <Timer size={28} className="text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Filter className="mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">Filter & Sort</h2>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
          <select
            name="work_location"
            value={filters.work_location}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Locations</option>
            <option value="office">Office</option>
            <option value="client">Client</option>
            <option value="wfh">WFH</option>
          </select>

          <select
            name="status_name"
            value={filters.status_name}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Half Day">Half Day</option>
            <option value="Late">Late</option>
          </select>

          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Sort By</option>
            <option value="emp_name">Name</option>
            <option value="check_in_time">Check-in Time</option>
            <option value="total_hours">Total Hours</option>
          </select>

          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-100"
          >
            <ArrowUpDown size={16} />
            {filters.sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <ClipboardList className="mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">Today Attendance</h2>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Work Location</th>
                <th className="px-6 py-3 text-left font-medium">Type</th>
                <th className="px-6 py-3 text-left font-medium">Time Range</th>
                <th className="px-6 py-3 text-left font-medium">Total Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{record.emp_name}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        locationColors[record.work_location] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {record.work_location}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        statusColors[record.status_name] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {record.status_name}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {record.check_in_time || record.check_out_time
                      ? `${record.check_in_time} - ${record.check_out_time}`
                      : '-'}
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-800">{record.total_hours || '0h 00m'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
