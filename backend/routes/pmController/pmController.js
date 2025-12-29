import pmSqlc from './pmSqlc.js';
import pool from '../../config/config.js';
import dbqueryexecute from '../../utils/dbqueryexecute.js';

export default {
  addProject(req, res) {
    const { pName, pDesc, leadId, startDate, endDate, statusId } = req.body;

    dbqueryexecute
      .executeSelectObj(
        pmSqlc.addProject({
          endDate,
          leadId,
          pDesc,
          pName,
          startDate,
          statusId,
        }),
        pool,
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  addTask(req, res) {
    const {
      title,
      description,
      priority,
      statusId,
      assigned_to_user_id,
      due_date,
    } = req.body;

    dbqueryexecute
      .executeSelectObj(
        pmSqlc.addTask({
          assigned_to_user_id,
          description,
          due_date,
          priority,
          statusId,
          title,
        }),
        pool,
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  addTeam(req, res) {
    dbqueryexecute
      .executeSelectObj(pmSqlc.addTeam(req.body), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        
        res.status(500).json(err);
      });
  },

  getEmp(_req, res) {
    dbqueryexecute
      .executeSelect(pmSqlc.getEmp(), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getProjectByUser(req, res) {
    const userId = req.params.id;

    dbqueryexecute
      .executeSelectObj(pmSqlc.getProjectByUser({ userId }), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getProjects(_req, res) {
    dbqueryexecute
      .executeSelect(pmSqlc.getProjects(), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getProjectStatus(_req, res) {
    dbqueryexecute
      .executeSelect(pmSqlc.getProjectStatus(), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getTask(_req, res) {
    dbqueryexecute
      .executeSelect(pmSqlc.getTask(), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getUserTask(req, res) {
    const userId = req.params.id;
    dbqueryexecute
      .executeSelectObj(pmSqlc.getUserTask({ userId }), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getTaskStatus(_req, res) {
    dbqueryexecute
      .executeSelect(pmSqlc.getTaskStatus(), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  updateProject(req, res) {
    const projectId = req.params.id;

    const { pName, pDesc, leadId, startDate, endDate, statusId } = req.body;

    dbqueryexecute
      .executeSelectObj(
        pmSqlc.updateProject({
          endDate,
          leadId,
          pDesc,
          pName,
          projectId,
          startDate,
          statusId,
        }),
        pool,
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  //For user
  updateProjectStatus(req, res) {
    const projectId = req.params.id;

    const { desc, statusId } = req.body;

    dbqueryexecute
      .executeSelectObj(
        pmSqlc.updateProjectStatus({
          desc,
          projectId: Number(projectId),
          statusId: Number(statusId),
        }),
        pool,
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  updateTask(req, res) {
    const taskId = req.params.id;

    const {
      title,
      description,
      priority,
      statusId,
      due_date,
      assigned_to_user_id,
    } = req.body;

    dbqueryexecute
      .executeSelectObj(
        pmSqlc.updateTask({
          assigned_to_user_id: Number(assigned_to_user_id),
          description,
          due_date,
          priority,
          statusId: Number(statusId),
          taskId: Number(taskId),
          title,
        }),
        pool,
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  addTimesheetEntry(req, res) {
    const {
      emp_id,
      project_id,
      timesheet_title,
      timesheet_description,
      hrs_spent,
    } = req.body;

    dbqueryexecute
      .executeSelectObj(
        pmSqlc.addTimesheetEntry({
          emp_id,
          project_id,
          timesheet_title,
          timesheet_description,
          hrs_spent,
        }),
        pool
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getTimesheetUser(req, res) {
    const userId = req.params.id;
    dbqueryexecute
      .executeSelectObj(pmSqlc.getTimesheetEntry({ userId }), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });

  },

  getTimesheetEntry(_req, res) {
    dbqueryexecute
      .executeSelect(pmSqlc.getTimesheetEntryAdmin(), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  updateTimesheetStatus(req, res) {
    const id = req.params.id;
    const { statusId } = req.body;
    dbqueryexecute.executeSelectObj(pmSqlc.updateTimesheetStatus({ id, statusId }), pool)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },


};
