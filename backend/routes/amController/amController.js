import amSqlc from './amSqlc.js';
import pool from '../../config/config.js';
import dbqueryexecute from '../../utils/dbqueryexecute.js';

export default {
  adminLeave(_req, res) {
    dbqueryexecute
      .executeSelect(amSqlc.adminLeave(), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err, message: 'error in fetching leave types' });
      });
  },
  applyLeave(req, res) {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    dbqueryexecute
      .executeSelectObj(
        amSqlc.applyLeave({ endDate, leaveType, reason, startDate, userId }),
        pool,
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err, message: 'error in applying leave' });
      });
  },
  getAttendanceRecords(req, res) {
    const userId = req.params.id;

    // 1st → Ensure missing dates are marked Absent
    dbqueryexecute
      .executeSelectObj(amSqlc.markMissingDatesAsAbsent({ userId }), pool)
      .then(() =>
        // 2nd → Fetch attendance normally
        dbqueryexecute.executeSelectObj(
          amSqlc.getAttendanceRecords({ userId }),
          pool,
        ),
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
          message: 'error in getting user attendance history',
        });
      });
  },

  getLeaveTypes(_req, res) {
    dbqueryexecute
      .executeSelect(amSqlc.getLeaveTypes(), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err, message: 'error in fetching leave types' });
      });
  },

  getTodaysAttendance(_req, res) {
    dbqueryexecute
      .executeSelect(amSqlc.getTodaysAttendance(), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err, message: 'error in fetching attendance' });
      });
  },

  setAttendance(req, res) {
    const { userId, workLocation } = req.body;

    dbqueryexecute
      .executeSelectObj(amSqlc.setAttendance({ userId, workLocation }), pool)
      .then((result) => {
        res
          .status(200)
          .json({ data: result, message: 'Attendance recorded successfully' });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err, message: 'error in recording attendance' });
      });
  },

  updateAttendance(req, res) {
    dbqueryexecute
      .executeSelectObj(
        amSqlc.updateAttendance({ userId: req.params.id }),
        pool,
      )
      .then((result) => {
        res.status(200).json({ data: result, message: 'Check-out successful' });
      })
      .catch((err) => {
        res.status(500).json({ error: err, message: 'error in check-out' });
      });
  },

  updateLeaveStatus(req, res) {
    const { statusId, leaveId } = req.body;

    dbqueryexecute
      .executeSelectObj(amSqlc.updateLeave({ leaveId, statusId }), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err, message: 'error in update status of leave' });
      });
  },

  viewLeave(req, res) {
    const userId = req.params.id;

    dbqueryexecute
      .executeSelectObj(amSqlc.viewLeave({ userId }), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err, message: 'error in fetching leave records' });
      });
  },
};
