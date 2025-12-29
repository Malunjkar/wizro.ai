import { Calendar, MapPin, ChevronDown, Clock, CalendarCheck, TrendingUp, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axiosConfig';

import { formatDate } from '../../lib/utils';

export default function AmDashboardPage() {
  const { user } = useAuth();

  const userId = user?.empID;

  const toHours = (timeStr) => {
    if (!timeStr) {
      return 0;
    }
    const [hrs, min, sec] = timeStr.split(':').map(Number);

    return hrs + min / 60 + (sec || 0) / 3600;
  };

  const [attendanceData, setAttendanceData] = useState([]);

  const [activeRange, setActiveRange] = useState('30');

  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [attendanceGraphData, setAttendanceGraphData] = useState([]);

  const ranges = [
    { label: 'Last 7 Days', value: '7' },
    { label: 'Last 14 Days', value: '14' },
    { label: 'Last 30 Days', value: '30' },
  ];

  const fetchAttendanceData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`am/get/${userId}`);

      setAttendanceData(response.data || []);
    } catch {
      toast.error('Failed to fetch attendance data');
    }
  }, [userId]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  // ----- Filter by Date Range -----
  const filteredByDate = useMemo(() => {
    const days = parseInt(activeRange, 10);

    const today = new Date();

    return attendanceData.filter((rec) => {
      const recordDate = new Date(rec.attendance_date);

      const diff = (today - recordDate) / (1000 * 60 * 60 * 24);

      return diff < days;
    });
  }, [attendanceData, activeRange]);

  // ----- Filter by Location -----
  const filteredAttendance = useMemo(() => {
    if (selectedLocation === 'All Locations') {
      return filteredByDate;
    }

    return filteredByDate.filter((rec) => {
      const location = rec.work_location?.toLowerCase() || '';

      if (selectedLocation.toLowerCase() === 'office') {
        return location === 'office';
      }
      if (selectedLocation.toLowerCase() === 'client') {
        return location === 'client';
      }
      if (selectedLocation.toLowerCase() === 'work from home') {
        return location === 'wfh';
      }

      return null;
    });
  }, [filteredByDate, selectedLocation]);

  // ----- Stats Calculation -----
  const calculateAttendanceStats = (data) => {
    if (!data || data.length === 0) {
      return {
        punctualityRate: '0.0',
        avgDailyWorkHours: '0.0',
        consistencyIndex: '0.0',
        stabilityRate: '0.0',
      };
    }

    let totalHours = 0,
      workingHourDays = 0,
      onTimeCount = 0,
      presentOrWorkedDays = 0,
      fullWorkDays = 0;

    data.forEach((rec) => {
      const isFullDay = toHours(rec.total_hours) >= 8;

      const statusPresent =
        rec.status_name === 'Present' || rec.status_name === 'Late' || rec.status_name === 'Half Day';

      if (rec.check_in_time !== null) {
        const [hrs, min, sec] = rec.check_in_time.split(':').map(Number);

        const checkIn = new Date();

        checkIn.setHours(hrs, min, sec, 0);

        const threshold = new Date();

        threshold.setHours(10, 30, 0, 0);

        if (checkIn <= threshold) {
          onTimeCount++;
        }
      }

      if (rec.total_hours && rec.total_hours !== '00:00:00') {
        totalHours += toHours(rec.total_hours);
        workingHourDays++;
      }

      if (statusPresent) {
        presentOrWorkedDays++;
      }

      if (isFullDay) {
        fullWorkDays++;
      }
    });

    const totalDays = data.length;

    return {
      punctualityRate: ((onTimeCount / totalDays) * 100 || 0).toFixed(1),
      avgDailyWorkHours: (workingHourDays > 0 ? totalHours / workingHourDays : 0).toFixed(1),
      consistencyIndex: ((presentOrWorkedDays / totalDays) * 10 || 0).toFixed(1),
      stabilityRate: ((fullWorkDays / totalDays) * 100 || 0).toFixed(1),
    };
  };

  const { punctualityRate, avgDailyWorkHours, consistencyIndex, stabilityRate } =
    calculateAttendanceStats(filteredAttendance);

  // ----- Weekly Hours Chart -----
  const last7DaysData = useMemo(() => {
    if (!filteredAttendance || filteredAttendance.length === 0) {
      return [];
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const today = new Date();

    const currentDay = today.getDay();

    const monday = new Date(today);

    monday.setDate(today.getDate() - ((currentDay + 6) % 7));

    const weekDays = [];

    for (let i = 0; i < 6; i++) {
      // Only Mon–Sat
      const day = new Date(monday);

      day.setDate(monday.getDate() + i);
      weekDays.push(day);
    }

    return weekDays.map((day) => {
      const record = filteredAttendance.find(
        (rec) => new Date(rec.attendance_date).toDateString() === day.toDateString(),
      );

      return {
        day: dayNames[day.getDay()],
        hours: record?.total_hours ? parseFloat(toHours(record.total_hours).toFixed(1)) : 0,
      };
    });
  }, [filteredAttendance]);

  // ----- Attendance Split Chart -----
  const attendanceSplit = useMemo(() => {
    const total = filteredAttendance.length || 1;

    const presentCount = filteredAttendance.filter((rec) => rec.status_name?.toLowerCase() === 'present').length;

    const halfDayCount = filteredAttendance.filter((rec) => rec.status_name?.toLowerCase() === 'half day').length;

    const absentCount = filteredAttendance.filter((rec) => rec.status_name?.toLowerCase() === 'absent').length;

    return [
      { name: `Present (${((presentCount / total) * 100).toFixed(0)}%)`, value: presentCount, color: '#4285F4' },
      { name: `Late/Half Day (${((halfDayCount / total) * 100).toFixed(0)}%)`, value: halfDayCount, color: '#F4B400' },
      { name: `Absent (${((absentCount / total) * 100).toFixed(0)}%)`, value: absentCount, color: '#DB4437' },
    ];
  }, [filteredAttendance]);

  // ----- Attendance Rate Graph Data -----
  const calculateAttendanceRateGraph = (data) => {
    if (!data || data.length === 0) {
      return [];
    }
    const xAxisDates = [5, 10, 15, 20, 25, 30];

    return xAxisDates.map((day) => {
      const recordsTillDay = data.filter((rec) => new Date(rec.attendance_date).getDate() <= day);

      const totalDays = recordsTillDay.length;

      const presentDays = recordsTillDay.filter((rec) => rec.status_name === 'Present').length;

      const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

      return {
        day,
        rate: Number(attendanceRate),
      };
    });
  };

  useEffect(() => {
    const formattedData = calculateAttendanceRateGraph(attendanceData);

    setAttendanceGraphData(formattedData);
  }, [attendanceData]);

  return (
    <div className="w-full px-6 mt-8">
      {/* Title */}
      <div className="w-full bg-white p2 space-y-6">
        {/* Heading Section */}
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Attendance Dashboard</h1>
        <p className="text-gray-500 text-sm">Monitor and analyze attendance trends across your organization</p>

        {/* Filters Section */}
        <div className="bg-gray-50 border rounded-xl p-4 flex flex-wrap items-center gap-4">
          <span className="text-gray-700 font-medium">Quick Range:</span>

          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => setActiveRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeRange === range.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}

          {/* Current Date */}
          <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg text-gray-700">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{formatDate(new Date())}</span>
          </div>

          {/* Location Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg text-gray-700 text-sm hover:bg-gray-100 transition-all duration-200"
            >
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{selectedLocation}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute mt-2 w-48 bg-white shadow-lg border rounded-lg overflow-hidden">
                {['All Locations', 'Office', 'Client', 'Work From Home'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-2 w-full text-left text-sm hover:bg-gray-100 transition"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Punctuality Rate */}
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Clock className="w-6 hrs-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Punctuality Rate</p>
            <p className="text-3xl font-semibold">{punctualityRate}%</p>
          </div>
        </div>

        {/* Avg. Daily Work Hours */}
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CalendarCheck className="w-6 hrs-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg. Daily Work Hours</p>
            <p className="text-3xl font-semibold">{avgDailyWorkHours} hrs</p>
          </div>
        </div>

        {/* Consistency Index */}
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <TrendingUp className="w-6 hrs-6 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Consistency Index</p>
            <p className="text-3xl font-semibold">{consistencyIndex}</p>
          </div>
        </div>

        {/* High Stability */}
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <ShieldCheck className="w-6 hrs-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">High Stability</p>
            <p className="text-3xl font-semibold">{stabilityRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Weekly Work Hours Chart */}
        <div className="bg-white shadow-md rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Weekly Working Hours (Mon–Sat)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#5c5cf0ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Split */}
        <div className="bg-white shadow-md rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Attendance Split</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={attendanceSplit}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                label
              >
                {attendanceSplit.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-5 mt-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Attendance Rate – Last 30 Days</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={attendanceGraphData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="80%" stopColor="#6366F1" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />

            {/* X-axis = 5,10,15,20,25,30 */}
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />

            {/* Y-axis = 0,25,50,75,100 */}
            <YAxis ticks={[0, 25, 50, 75, 100]} domain={[0, 100]} tick={{ fontSize: 12 }} />

            <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />

            <Area
              type="monotone"
              dataKey="rate"
              stroke="#6366F1"
              strokeWidth={3}
              fill="url(#attendanceFill)"
              dot={{ rec: 4 }}
              activeDot={{ rec: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
