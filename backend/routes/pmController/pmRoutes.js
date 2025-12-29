import express from 'express';

import pmController from './pmController.js';

const pmRoutes = express.Router();

//status
pmRoutes.route('/taskStatus').get(pmController.getTaskStatus);
pmRoutes.route('/projectStatus').get(pmController.getProjectStatus);

pmRoutes.route('/getEmp').get(pmController.getEmp);
pmRoutes.route('/addTeam').post(pmController.addTeam);

//projects
pmRoutes.route('/getProjects').get(pmController.getProjects);
pmRoutes.route('/getProjectByUser/:id').get(pmController.getProjectByUser);
pmRoutes.route('/addProject').post(pmController.addProject);
pmRoutes.route('/updateProject/:id').post(pmController.updateProject);
pmRoutes.post('/updateProjectStatus/:id', pmController.updateProjectStatus);

//tasks
pmRoutes.route('/getTask').get(pmController.getTask);
pmRoutes.post('/addTask', pmController.addTask);
pmRoutes.post('/updateTask/:id', pmController.updateTask);
pmRoutes.route('/getUserTask/:id').get(pmController.getUserTask);

//TimeSheet 
pmRoutes.post('/addTimesheetEntry', pmController.addTimesheetEntry);
pmRoutes.route('/getUserTimesheet/:id').get(pmController.getTimesheetUser);
pmRoutes.route('/getTimesheet').get(pmController.getTimesheetEntry);
pmRoutes.post('/updateTimesheetStatus/:id', pmController.updateTimesheetStatus);

export default pmRoutes;
