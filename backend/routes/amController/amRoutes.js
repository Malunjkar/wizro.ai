import express from 'express';

import amController from './amController.js';

const amRoutes = express.Router();

amRoutes.route('/get/:id').get(amController.getAttendanceRecords);
amRoutes.route('/set').post(amController.setAttendance);
amRoutes.route('/update/:id').post(amController.updateAttendance);
amRoutes.route('/today').get(amController.getTodaysAttendance);

amRoutes.route('/leaveType').get(amController.getLeaveTypes);
amRoutes.route('/getLeave/:id').get(amController.viewLeave);
amRoutes.route('/applyLeave').post(amController.applyLeave);

amRoutes.route('/adminLeavePage').get(amController.adminLeave);
amRoutes.route('/updateLeave').post(amController.updateLeaveStatus);

export default amRoutes;
