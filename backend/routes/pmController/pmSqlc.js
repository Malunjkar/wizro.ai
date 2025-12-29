export default {
  addProject(data) {
    const obj = {};

    const { pName, pDesc, leadId, startDate, endDate, statusId } = data;

    obj.queryString = `INSERT INTO tbl_pm_project_master(
    s_project_name,
    s_project_description,
    n_project_lead_emp_id,
    d_start_date,
    d_deadline_date,
    n_status_id,
    t_created_at,
    t_updated_at)
    values($1,$2,$3,$4,$5,$6,NOW(),NOW());`;

    obj.arr = [pName, pDesc, leadId, startDate, endDate, statusId];

    return obj;
  },

  addTask(data) {
    const obj = {};

    const {
      title,
      description,
      priority,
      statusId,
      assigned_to_user_id,
      due_date,
    } = data;

    obj.queryString = `
    INSERT INTO tbl_task_master (
      s_task_title,
      s_task_description,
      s_priority,
      n_status_id,
      n_assigned_to_user_id,
      d_due_date
    )
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

    obj.arr = [
      title,
      description || null,
      priority,
      statusId,
      assigned_to_user_id,
      due_date,
    ];

    return obj;
  },

  addTeam(data) {
    const obj = {};

    const { projectId, teamName, teamCount, memberIds } = data;

    const teamNameParam = memberIds.length + 2;

    const teamCountParam = memberIds.length + 3;

    obj.queryString = `
    INSERT INTO tbl_pm_projectemp_map 
      (n_project_id, n_user_id, s_team_name, n_team_count)
    VALUES 
      ${memberIds
        .map((_, i) => `($1, $${i + 2}, $${teamNameParam}, $${teamCountParam})`)
        .join(', ')};
  `;

    obj.arr = [
      Number(projectId),
      ...memberIds.map((memId) => Number(memId)),
      teamName,
      Number(teamCount),
    ];

    return obj;
  },

  getEmp() {
    const queryString = `SELECT n_user_id,s_full_name FROM tbl_users WHERE n_role = 3 order by n_user_id ASC;`;

    return queryString;
  },

  getProjectByUser(data) {
    const obj = {};

    const { userId } = data;

    obj.queryString = `SELECT 
    p.n_project_id, 
    p.s_project_name AS project_name,
    p.s_project_description AS description,
    p.n_project_lead_emp_id AS team_lead,
    p.n_status_id,
    s.s_status_name AS status,
    u.s_full_name AS project_lead,
    TO_CHAR(p.d_start_date, 'YYYY-MM-DD') AS start_date,
    TO_CHAR(p.d_deadline_date, 'YYYY-MM-DD') AS end_date,
    COUNT(m.n_user_id) AS team_count
FROM public.tbl_pm_project_master p
LEFT JOIN public.tbl_pm_status_master s
    ON s.n_status_id = p.n_status_id
LEFT JOIN public.tbl_users u
    ON u.n_user_id = p.n_project_lead_emp_id
LEFT JOIN public.tbl_pm_projectemp_map m
    ON m.n_project_id = p.n_project_id
WHERE 
    p.n_project_lead_emp_id = $1   -- user is project lead
    OR m.n_user_id = $1            -- user is team member
GROUP BY 
    p.n_project_id, 
    p.s_project_name,
    p.s_project_description,
    s.s_status_name,
    u.s_full_name,
    p.d_start_date,
    p.d_deadline_date,
    p.n_project_lead_emp_id,
    p.n_status_id
ORDER BY p.n_project_id ASC;
;
  `;
    obj.arr = [userId];

    return obj;
  },

  getProjects() {
    const queryString = `SELECT 
    p.n_project_id, 
    p.s_project_name AS project_name,
    p.s_project_description AS description,
    p.n_Project_lead_emp_id AS team_lead,
    p.n_status_id,
    s.s_status_name AS status,
    u.s_full_name AS project_lead,
    TO_CHAR(p.d_start_date, 'YYYY-MM-DD') AS start_date,
    TO_CHAR(p.d_deadline_date, 'YYYY-MM-DD') AS end_date,
    COUNT(m.n_user_id) AS team_count
FROM public.tbl_pm_project_master p
LEFT JOIN public.tbl_pm_status_master s
    ON s.n_status_id = p.n_status_id
LEFT JOIN public.tbl_users u
    ON u.n_user_id = p.n_project_lead_emp_id
LEFT JOIN public.tbl_pm_projectemp_map m
    ON m.n_project_id = p.n_project_id
GROUP BY 
    p.n_project_id, 
    p.s_project_name,
    s.s_status_name,
    u.s_full_name,
    p.d_start_date,
    p.d_deadline_date
ORDER BY p.n_project_id ASC;
  `;

    return queryString;
  },

  getProjectStatus() {
    const queryString = `SELECT n_status_id , s_status_name 
  FROM tbl_pm_status_master WHERE s_status_type = 'project';`;

    return queryString;
  },

  getTask() {
    const queryString = `SELECT
t.n_task_id AS task_id,
t.s_task_title AS task_name,
t.s_task_description AS task_desc,
t.n_status_id AS status_id,
s.s_status_name AS status_name,
u.s_full_name AS emp_name,
TO_CHAR(t.d_due_date, 'YYYY-MM-DD') AS task_deadline,
t.s_priority AS task_priority,
TO_CHAR(t.t_created_at, 'YYYY-MM-DD') AS created_at
FROM public.tbl_task_master t
LEFT JOIN 
public.tbl_users u
ON t.n_assigned_to_user_id = u.n_user_id
LEFT JOIN 
public.tbl_pm_status_master s
ON s.n_status_id = t.n_status_id
ORDER BY n_task_id ASC `;

    return queryString;
  },
  
  getUserTask(data) {
    const obj = {};

    const { userId } = data;
    obj.queryString = `SELECT
t.n_task_id AS task_id,
t.s_task_title AS task_name,
t.s_task_description AS task_desc,
t.n_status_id AS status_id,
s.s_status_name AS status_name,
u.s_full_name AS emp_name,
TO_CHAR(t.d_due_date, 'YYYY-MM-DD') AS task_deadline,
t.s_priority AS task_priority,
TO_CHAR(t.t_created_at, 'YYYY-MM-DD') AS created_at
FROM public.tbl_task_master t
LEFT JOIN 
public.tbl_users u
ON t.n_assigned_to_user_id = u.n_user_id
LEFT JOIN 
public.tbl_pm_status_master s
ON s.n_status_id = t.n_status_id
WHERE u.n_user_id = $1
ORDER BY n_task_id ASC `;
    obj.arr = [userId];

    return obj;
  },

  getTaskStatus() {
    const queryString = `SELECT n_status_id , s_status_name 
  FROM tbl_pm_status_master WHERE s_status_type = 'task';`;

    return queryString;
  },

  updateProject(data) {
    const obj = {};

    const { projectId, pName, pDesc, leadId, startDate, endDate, statusId } =
      data;

    obj.queryString = `
    UPDATE tbl_pm_project_master
    SET 
      s_project_name = $1,
      s_project_description = $2,
      n_project_lead_emp_id = $3,
      d_start_date = $4,
      d_deadline_date = $5,
      n_status_id = $6,
      t_updated_at = NOW()
    WHERE n_project_id = $7;
  `;

    obj.arr = [pName, pDesc, leadId, startDate, endDate, statusId, projectId];

    return obj;
  },

  updateProjectStatus(data) {
    const obj = {};

    const { desc, projectId, statusId } = data;

    obj.queryString = `
    UPDATE public.tbl_pm_project_master
    SET 
      s_project_description = $1,
      n_status_id = $2,
      t_updated_at = NOW()
    WHERE n_project_id = $3;
  `;

    obj.arr = [desc, statusId, projectId];

    return obj;
  },

  updateTask(data) {
    const obj = {};

    const {
      taskId,
      title,
      description,
      priority,
      statusId,
      due_date,
      assigned_to_user_id,
    } = data;

    obj.queryString = `
    UPDATE public.tbl_task_master
    SET
      s_task_title = $1,
      s_task_description = $2,
      s_priority = $3,
      n_status_id = $4,
      d_due_date = $5,
      n_assigned_to_user_id = $6,
      t_updated_at = NOW()
    WHERE n_task_id = $7;
  `;

    obj.arr = [
      title,
      description,
      priority,
      statusId,
      due_date,
      assigned_to_user_id,
      taskId,
    ];

    return obj;
  },

  addTimesheetEntry(data) {
    const obj = {};

    const {
      emp_id,
      project_id,
      timesheet_title,
      timesheet_description,
      hrs_spent,
    } = data;

    obj.queryString = `
    INSERT INTO public.tbl_timesheet_master (
      n_emp_id,
      n_project_id,
      s_timesheet_title,
      s_timesheet_description,
      n_hrs_spent,
      n_status_id,
      t_created_at,
      t_updated_at
    )
    VALUES ($1, $2, $3, $4, $5, 10, NOW(), NOW())
  `;

    obj.arr = [
      emp_id,
      project_id,
      timesheet_title,
      timesheet_description || null,
      hrs_spent,
    ];

    return obj;
  },

  //user
  getTimesheetEntry(data) {
    const obj = {}

    const { userId } = data;

    obj.queryString = `
    SELECT 
t.n_timesheet_id  ,
t.s_timesheet_title AS title,
t.s_timesheet_description AS time_desc,
u.s_full_name AS emp_name,
p.s_project_name AS project_name,
t.n_hrs_spent,
s.s_status_name,
t.t_created_at 
FROM public.tbl_timesheet_master t
LEFT JOIN 
public.tbl_users u
ON u.n_user_id = t.n_emp_id
LEFT JOIN 
public.tbl_pm_project_master p
ON t.n_project_id = p.n_project_id 
LEFT JOIN 
public.tbl_pm_status_master s
ON s.n_status_id = t.n_status_id
WHERE u.n_user_id = $1
ORDER BY n_timesheet_id ASC ;
`;
    obj.arr = [userId];

    return obj;

  },

  //admin
  getTimesheetEntryAdmin() {
    const queryString = `
    SELECT 
t.n_timesheet_id  ,
t.s_timesheet_title AS title,
t.s_timesheet_description AS time_desc,
u.n_user_id AS n_emp_id,
u.s_full_name AS emp_name,
p.s_project_name AS project_name,
t.n_hrs_spent,
s.s_status_name,
t.t_created_at 
FROM public.tbl_timesheet_master t
LEFT JOIN 
public.tbl_users u
ON u.n_user_id = t.n_emp_id
LEFT JOIN 
public.tbl_pm_project_master p
ON t.n_project_id = p.n_project_id 
LEFT JOIN 
public.tbl_pm_status_master s
ON s.n_status_id = t.n_status_id
ORDER BY n_timesheet_id ASC ;
`;


    return queryString;

  },

  updateTimesheetStatus(data) {
    const obj = {};
    const { id, statusId } = data;

    obj.queryString = `
    UPDATE public.tbl_timesheet_master
    SET n_status_id = $1
    WHERE 
    n_timesheet_id = $2;`
      ;
    obj.arr = [
      statusId, id
    ];
    return obj;
  },

};
