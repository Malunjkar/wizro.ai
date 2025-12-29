export default {
  adminLeave() {
    const query = `
    SELECT
      l.n_leave_id AS leave_id,
      u.n_user_id AS emp_id,
      u.s_full_name AS emp_name,
      lt.s_leave_type_name AS leave_type,
      l.s_reason AS reason,
      TO_CHAR(l.d_start_date, 'YYYY-MM-DD') AS start_date,
      TO_CHAR(l.d_end_date, 'YYYY-MM-DD') AS end_date,
      s.s_status_name AS status_name,
      TO_CHAR(l.d_created_at, 'YYYY-MM-DD HH24:MI:SS') AS applied_on
    FROM public.tbl_leave_master l
    LEFT JOIN public.tbl_leave_type_master lt ON l.n_leave_type_id = lt.n_leave_type_id
    LEFT JOIN public.tbl_am_status_master s ON l.n_status_id = s.n_status_id
    LEFT JOIN public.tbl_users u ON u.n_user_id = l.n_user_id
    ORDER BY l.d_created_at ;
  `;

    return query;
  },

  applyLeave(data) {
    const obj = {};

    const { userId, leaveType, startDate, endDate, reason } = data;

    obj.queryString = `INSERT INTO tbl_leave_master(
      n_user_id,
      n_leave_type_id,
      d_start_date,
      d_end_date,
      s_reason,
      n_status_id,
      d_created_at,
      d_updated_at)
      VALUES ($1, $2, $3, $4,$5, 6,NOW(), NOW());
    `;

    obj.arr = [userId, leaveType, startDate, endDate, reason];

    return obj;
  },

  getAttendanceRecords(data) {
    const obj = {};

    const { userId } = data;

    obj.queryString = `
      SELECT
          TO_CHAR(a.d_created_at, 'YYYY-MM-DD') AS attendance_date,
          a.s_work_loc AS work_location,
          TO_CHAR(a.t_check_in, 'HH24:MI:SS') AS check_in_time,
          TO_CHAR(a.t_check_out, 'HH24:MI:SS') AS check_out_time,
          s.s_status_name AS status_name,
          TO_CHAR(a.t_work_hrs, 'HH24:MI:SS') AS total_hours
          
      FROM public.tbl_am_attendance a
      JOIN public.tbl_am_status_master s 
          ON a.n_status_id = s.n_status_id
      WHERE a.n_user_id = $1
      ORDER BY a.d_created_at DESC;
    `;

    obj.arr = [userId];

    return obj;
  },

  getLeaveTypes() {
    const query = `
      SELECT
          n_leave_type_id,
          s_leave_type_name
      FROM public.tbl_leave_type_master;
    `;

    return query;
  },

  getTodaysAttendance() {
    const query = `
      SELECT
          u.s_full_name AS emp_name,
          TO_CHAR(a.d_created_at, 'YYYY-MM-DD') AS attendance_date,
          a.s_work_loc AS work_location,
          TO_CHAR(a.t_check_in, 'HH24:MI:SS') AS check_in_time,
          TO_CHAR(a.t_check_out, 'HH24:MI:SS') AS check_out_time,
          s.s_status_name AS status_name,
          TO_CHAR(a.t_work_hrs, 'HH24:MI:SS') AS total_hours
          
      FROM public.tbl_am_attendance a
      JOIN public.tbl_am_status_master s
          ON a.n_status_id = s.n_status_id
   	  JOIN public.tbl_users u
          ON a.n_user_id = u.n_user_id 
      WHERE a.d_created_at::date = CURRENT_DATE;
    `;

    return query;
  },

  markMissingDatesAsAbsent(data) {
    const obj = {};

    const { userId } = data;

    obj.queryString = `
    INSERT INTO tbl_am_attendance (n_user_id, s_work_loc, n_status_id, d_created_at)
    SELECT $1, '-', 2, date::date
    FROM generate_series(
      (SELECT COALESCE(MAX(d_created_at)::date, CURRENT_DATE - INTERVAL '1 day') FROM tbl_am_attendance WHERE n_user_id = $1) + INTERVAL '1 day',
      CURRENT_DATE - INTERVAL '1 day',
      INTERVAL '1 day'
    ) AS date
    WHERE NOT EXISTS (
      SELECT 1 FROM tbl_am_attendance
      WHERE n_user_id = $1 AND d_created_at::date = date::date
    );
  `;

    obj.arr = [userId];

    return obj;
  },

  setAttendance(data) {
    const obj = {};

    const { userId, workLocation } = data;

    obj.queryString = `
      INSERT INTO tbl_am_attendance (
        n_user_id,
        t_check_in,
        s_work_loc,
        n_status_id,
        d_created_at
      )
      SELECT 
        $1,
        to_char(date_trunc('minute', NOW()), 'YYYY-MM-DD HH24:MI:00')::timestamp,
        $2,
        1,
        to_char(date_trunc('minute', NOW()), 'YYYY-MM-DD HH24:MI:00')::timestamp
      WHERE NOT EXISTS (
        SELECT 1 
        FROM tbl_am_attendance
        WHERE n_user_id = $1 
        AND d_created_at::date = CURRENT_DATE
      );
    `;
    obj.arr = [userId, workLocation];

    return obj;
  },

  updateAttendance(data) {
    const obj = {};

    const { userId } = data;

    obj.queryString = `UPDATE public.tbl_am_attendance
SET
  t_check_out = to_char(date_trunc('minute', NOW()), 'YYYY-MM-DD HH24:MI:00')::timestamp,
  t_work_hrs  = to_char(date_trunc('minute', NOW()), 'YYYY-MM-DD HH24:MI:00')::timestamp - t_check_in,
  n_status_id = CASE 
                  WHEN EXTRACT(EPOCH FROM (
                    to_char(date_trunc('minute', NOW()), 'YYYY-MM-DD HH24:MI:00')::timestamp - t_check_in
                  )) / 3600 < 8 THEN 3 
                  ELSE n_status_id 
                END,
  d_updated_at = NOW()
WHERE n_user_id = $1
  AND t_check_out IS NULL;`;
    obj.arr = [userId];

    return obj;
  },

  updateLeave(data) {
    const obj = {};

    const { statusId, leaveId } = data;

    obj.queryString = `UPDATE tbl_leave_master
    SET n_status_id = $1
    WHERE n_leave_id = $2;`;

    obj.arr = [statusId, leaveId];

    return obj;
  },

  viewLeave(data) {
    const obj = {};

    const { userId } = data;

    obj.queryString = `
      SELECT          
          lt.s_leave_type_name AS leave_type,
          l.s_reason AS reason,
          TO_CHAR(l.d_start_date, 'YYYY-MM-DD') AS start_date,
          TO_CHAR(l.d_end_date, 'YYYY-MM-DD') AS end_date,
          s.s_status_name AS status_name,
          TO_CHAR(l.d_created_at, 'YYYY-MM-DD HH24:MI:SS') AS applied_on
          
      FROM public.tbl_leave_master l
      JOIN public.tbl_leave_type_master lt
          ON l.n_leave_type_id = lt.n_leave_type_id
      JOIN public.tbl_am_status_master s
          ON l.n_status_id = s.n_status_id
      WHERE l.n_user_id = $1
      ORDER BY l.d_created_at DESC;
    `;

    obj.arr = [userId];

    return obj;
  },
};
