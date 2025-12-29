import { Clock, MapPin, CheckCircle, XCircle, Hourglass, LogIn, LogOut, Zap, CalendarDays, Gift } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';

import axiosInstance from '../../lib/axiosConfig';

export default function AmAttendancePage() {
  const { user } = useAuth();

  const userId = user?.empID;

  const userName = user?.fullName;

  const CLIENT_LOCATIONS = [
    { id: 'client_1', name: 'PIL', latitude: 19.02206, longitude: 73.01735, radius: 100 },
    { id: 'client_2', name: 'Suzlon', latitude: 18.512251, longitude: 73.935095, radius: 100 },
    { id: 'client_3', name: 'WindWorld', latitude: 19.133210941405018, longitude: 72.83372168541877, radius: 100 },
    { id: 'client_4', name: 'Sterling and Wilson', latitude: 19.060789, longitude: 72.91214, radius: 200 },
    { id: 'client_5', name: 'Godrej One', latitude: 19.0935344, longitude: 72.9204274, radius: 1000 },
    { id: 'client_6', name: 'Essel Propack', latitude: 19.0525495, longitude: 72.2717434, radius: 1000 },
  ];

  const OFFICE_COORDINATES = {
    latitude: 19.0808064,
    longitude: 72.9808896,
    radius: 500,
  };

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

  const [currentTime, setCurrentTime] = useState(new Date());

  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const [isCheckedOut, setIsCheckedOut] = useState(false);

  const [_checkInLocation, setCheckInLocation] = useState('');

  const [selectedLocation, setSelectedLocation] = useState('');

  const [selectedClient, setSelectedClient] = useState('');

  const [showLocationSelect, setShowLocationSelect] = useState(false);

  const [actionType, setActionType] = useState('');

  const [geoLocation, setGeoLocation] = useState({ lat: null, lon: null });

  const [loading, setLoading] = useState(false);

  const [latestRecord, setLatestRecord] = useState(null);

  const calculateDistance = (latOne, lonOne, latTwo, lonTwo) => {
    const earthRadius = 6371e3;

    const latRadOne = (latOne * Math.PI) / 180;

    const latRadTwo = (latTwo * Math.PI) / 180;

    const deltaLat = ((latTwo - latOne) * Math.PI) / 180;

    const deltaLon = ((lonTwo - lonOne) * Math.PI) / 180;

    const haversineA =
      Math.sin(deltaLat / 2) ** 2 + Math.cos(latRadOne) * Math.cos(latRadTwo) * Math.sin(deltaLon / 2) ** 2;

    return earthRadius * 2 * Math.atan2(Math.sqrt(haversineA), Math.sqrt(1 - haversineA));
  };

  const fetchGeolocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported.');

      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeoLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => toast.error('Please allow location access.'),
    );
  };

  const validateLocation = () => {
    if (!geoLocation.lat) {
      toast.error('Unable to fetch GPS location.');

      return false;
    }
    let target = null;
    if (selectedLocation === 'office') {
      target = OFFICE_COORDINATES;
    }
    if (selectedLocation === 'client') {
      target = CLIENT_LOCATIONS.find((cli) => cli.id === selectedClient);
    }
    if (!target) {
      return true;
    }

    const dist = calculateDistance(geoLocation.lat, geoLocation.lon, target.latitude, target.longitude);

    if (dist > target.radius) {
      toast.error(`You are not within ${target.name || 'office'} area. (${dist.toFixed(1)}m away)`);

      return false;
    }
    toast.success('Location validated successfully!');

    return true;
  };

  const handleCheckIn = () => {
    setActionType('check-in');
    setShowLocationSelect(true);

    return null;
  };

  const handleCheckOut = () => {
    setActionType('check-out');
    setShowLocationSelect(true);

    return null;
  };

  const confirmAction = async () => {
    if (!selectedLocation) {
      return toast.error('Select a location first.');
    }
    if (selectedLocation !== 'wfh' && !validateLocation()) {
      return null;
    }

    setLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];

      const todayRecord = attendanceRecords.find((rec) => rec.attendance_date === today);

      if (actionType === 'check-in') {
        const payload = {
          userId,
          workLocation: selectedLocation === 'client' ? selectedClient : selectedLocation,
        };

        const res = await axiosInstance.post(`/am/set`, payload);

        if (res.status === 200) {
          setIsCheckedIn(true);
          setCheckInLocation(payload.workLocation);
          toast.success('Checked In successfully!');
        } else {
          toast.error('Failed to check in.');
        }
      } else if (actionType === 'check-out') {
        const checkInLoc = todayRecord.work_location?.toLowerCase();

        const checkOutLoc =
          selectedLocation === 'client' ? selectedClient.toLowerCase() : selectedLocation.toLowerCase();

        if (checkInLoc !== checkOutLoc) {
          toast.error(`You must check out from the same location you checked in (${checkInLoc}).`);
          setLoading(false);

          return null;
        }
        const res = await axiosInstance.post(`/am/update/${userId}`);

        if (res.status === 200) {
          setIsCheckedOut(true);
          toast.success('Checked Out successfully!');
        } else {
          toast.error('Failed to check out.');
        }
      }

      await fetchAttendanceRecords();
      setShowLocationSelect(false);
      setSelectedLocation('');
      setSelectedClient('');
    } catch {
      toast.error('Failed to record attendance.');
    } finally {
      setLoading(false);
    }

    return null;
  };

  // Fetch attendance records from backend
  const fetchAttendanceRecords = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`am/get/${userId}`);

      const records = response.data || [];

      setAttendanceRecords(records);

      const today = new Date().toISOString().split('T')[0];

      const todayRecord = records.find((rec) => rec.attendance_date === today);

      setLatestRecord(todayRecord || null);

      if (todayRecord) {
        setIsCheckedIn(!!todayRecord.check_in_time);
        setIsCheckedOut(!!todayRecord.check_out_time);
      } else {
        setIsCheckedIn(false);
        setIsCheckedOut(false);
      }
    } catch {
      toast.error('Error fetching attendance records.');
    }
  }, [userId]);

  useEffect(() => {
    const init = async () => {
      await fetchGeolocation();
      await fetchAttendanceRecords();
    };

    init();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => clearInterval(timer);
  }, [fetchAttendanceRecords]);

  const totalAbsent = attendanceRecords.filter((rec) => rec.status_name?.toLowerCase() === 'absent').length;

  const totalWorkingDays = useMemo(
    () =>
      attendanceRecords.reduce((acc, rec) => {
        const status = rec.status_name?.toLowerCase();

        if (status === 'present' || status === 'late') {
          return acc + 1;
        }
        if (status === 'half day') {
          return acc + 0.5;
        }

        return acc;
      }, 0),
    [attendanceRecords],
  );

  const calculateAvgWorkHrs = () => {
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return '0.0 hrs';
    }

    const now = new Date();

    // Start from Monday
    const monday = new Date(now);

    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    // End on Saturday
    const saturday = new Date(monday);

    saturday.setDate(monday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    const weekRecords = attendanceRecords.filter((rec) => {
      const recDate = new Date(rec.attendance_date);

      const status = rec.status_name?.toLowerCase();

      return recDate >= monday && recDate <= saturday && status !== 'absent';
    });

    if (weekRecords.length === 0) {
      return '0.0 hrs';
    }

    const totalSeconds = weekRecords.reduce((acc, rec) => {
      if (rec.total_hours) {
        const [hrs, min, sec] = rec.total_hours.split(':').map(Number);

        return acc + hrs * 3600 + min * 60 + sec;
      }

      return acc;
    }, 0);

    const totalHours = totalSeconds / 3600;

    const avgHours = totalHours / weekRecords.length;

    return `${avgHours.toFixed(1)} hrs`;
  };

  const calculateTotalOvertime = () => {
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return '0.0 hrs';
    }

    const now = new Date();

    const currentMonth = now.getMonth();

    const currentYear = now.getFullYear();

    const monthRecords = attendanceRecords.filter((rec) => {
      const recDate = new Date(rec.attendance_date);

      const status = rec.status_name?.toLowerCase();

      return recDate.getMonth() === currentMonth && recDate.getFullYear() === currentYear && status !== 'absent';
    });

    if (monthRecords.length === 0) {
      return '0.0 hrs';
    }

    const totalOvertimeSeconds = monthRecords.reduce((acc, rec) => {
      if (rec.total_hours) {
        const [hrs, min, sec] = rec.total_hours.split(':').map(Number);

        const dailySeconds = hrs * 3600 + min * 60 + sec;

        const overtime = Math.max(0, dailySeconds - 8 * 3600);

        return acc + overtime;
      }

      return acc;
    }, 0);

    const overtimeHours = totalOvertimeSeconds / 3600;

    return `${overtimeHours.toFixed(1)} hrs`;
  };

  const avgWorkHrs = calculateAvgWorkHrs(attendanceRecords);

  const totalOvertime = calculateTotalOvertime(attendanceRecords);

  return (
    <div>
      {/* profile card and check-in/out section */}
      <div className="flex justify-center mt-10 px-4">
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl">
          {/* Card 1 - User Status */}
          <div className="bg-white rounded-2xl shadow-md w-full md:w-1/2 p-4 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl">
                {userName
                  ? userName
                      .split(' ')
                      .map((name) => name[0])
                      .join('')
                      .toUpperCase()
                  : 'U'}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{userName || 'User'}</h2>
                <p className="text-gray-500 text-sm">Software Engineer</p>
              </div>
            </div>

            <div className="text-sm text-gray-700 mb-2">Today&apos;s Status:</div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                latestRecord?.check_out_time
                  ? 'bg-gray-100 text-gray-700'
                  : latestRecord?.check_in_time
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {latestRecord?.check_out_time ? (
                <>
                  <CheckCircle size={16} /> Checked Out
                </>
              ) : latestRecord?.check_in_time ? (
                <>
                  <CheckCircle size={16} /> Checked In
                </>
              ) : (
                <>
                  <XCircle size={16} /> Not Checked In
                </>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-3">
              <MapPin size={14} className="inline mr-1 text-green-500" />
              Geo-validation:{' '}
              <span className="font-medium text-gray-700 capitalize">{latestRecord?.work_location || '—'}</span>
            </p>
          </div>

          {/* Card 2 - Time and Buttons */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md w-full md:w-1/2">
            <Clock size={36} className="text-blue-500 mb-3" />
            <h2 className="text-3xl font-bold mb-2">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </h2>

            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <button
                onClick={handleCheckIn}
                disabled={isCheckedIn}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 ${
                  isCheckedIn
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <LogIn size={18} /> Check In
              </button>

              <button
                onClick={handleCheckOut}
                disabled={!isCheckedIn || isCheckedOut}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 ${
                  !isCheckedIn || isCheckedOut
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                <LogOut size={18} /> Check Out
              </button>
            </div>

            {/* Dropdown */}
            {showLocationSelect && (
              <div className="mt-4 w-full">
                <select
                  className="border border-gray-400 rounded-md p-2 w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#111827',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                  }}
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="" className="bg-transparent text-gray-900">
                    Select Location
                  </option>
                  <option value="office" className="bg-transparent text-gray-900">
                    🏢 Office
                  </option>
                  <option value="client" className="bg-transparent text-gray-900">
                    💼 Client Site
                  </option>
                  <option value="wfh" className="bg-transparent text-gray-900">
                    🏠 Work From Home
                  </option>
                </select>

                {selectedLocation === 'client' && (
                  <select
                    className="border border-gray-400 rounded-md p-2 w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 appearance-none"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#111827',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                    }}
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  >
                    <option value="" className="bg-transparent text-gray-900">
                      Select Client
                    </option>
                    {CLIENT_LOCATIONS.map((clientLoc) => (
                      <option key={clientLoc.id} value={clientLoc.id} className="bg-transparent text-gray-900">
                        {clientLoc.name}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={confirmAction}
                  disabled={loading}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-3 w-full hover:bg-blue-600 transition-all duration-200"
                >
                  {loading ? 'Processing...' : actionType === 'check-out' ? 'Confirm Check Out' : 'Confirm Check In'}
                </button>
              </div>
            )}

            {isCheckedIn && (
              <p className="mt-4 text-green-600 font-semibold text-center">
                {isCheckedOut ? 'Checked Out Today ' : 'Checked In Today '}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-6 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* Total Working Days */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-6 w-full">
            <div>
              <p className="text-gray-500 text-sm">Total Working Days</p>
              <p className="text-3xl font-bold text-gray-900">{totalWorkingDays}</p>
            </div>
            <Gift size={28} className="text-blue-500" />
          </div>

          {/* Total Absent Days */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-6 w-full">
            <div>
              <p className="text-gray-500 text-sm">Total Absent Days</p>
              <p className="text-3xl font-bold text-gray-900">{totalAbsent}</p>
            </div>
            <XCircle size={28} className="text-red-500" />
          </div>

          {/* Avg Working Hours (Week) */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-6 w-full">
            <div>
              <p className="text-gray-500 text-sm">Avg Working Hrs (Wk)</p>
              <p className="text-3xl font-bold text-gray-900">{avgWorkHrs}</p>
            </div>
            <Hourglass size={28} className="text-green-500" />
          </div>

          {/* Total Overtime (Month) */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-6 w-full">
            <div>
              <p className="text-gray-500 text-sm">Total Overtime (Month)</p>
              <p className="text-3xl font-bold text-gray-900">{totalOvertime}</p>
            </div>
            <Zap size={28} className="text-orange-500" />
          </div>
        </div>
      </div>
      {/* Attendance history table */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <CalendarDays className="mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">Attendance History</h2>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Work Location</th>
                <th className="px-6 py-3 text-left font-medium">Type</th>
                <th className="px-6 py-3 text-left font-medium">Time Range</th>
                <th className="px-6 py-3 text-left font-medium">Total Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{record.attendance_date}</td>
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

      {/* statistical Cards */}
    </div>
  );
}
