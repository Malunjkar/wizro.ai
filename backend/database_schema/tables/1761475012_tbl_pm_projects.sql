-- Table: public.tbl_pm_projects

DROP TABLE IF EXISTS public.tbl_pm_projects;

CREATE TABLE IF NOT EXISTS public.tbl_pm_projects
(
    n_project_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    s_project_name character varying(100) COLLATE pg_catalog."default",
    n_group_name integer,
    n_project_status integer,
    n_project_manager integer,
    j_project_teams jsonb,
    d_project_start date,
    d_project_end date,
    d_created_by integer,
    d_created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    d_updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
)

TABLESPACE pg_default;


ALTER TABLE IF EXISTS public.tbl_pm_projects OWNER to postgres;
