-- SQL file generated
-- Table: public.tbl_am_status_master

-- DROP TABLE IF EXISTS public.tbl_am_status_master;

CREATE SEQUENCE IF NOT EXISTS status_master_n_status_id_seq;
CREATE TABLE IF NOT EXISTS public.tbl_am_status_master (
    n_status_id integer NOT NULL DEFAULT nextval('status_master_n_status_id_seq'::regclass),
    s_status_name character varying(50) NOT NULL,
    s_description character varying(255),
    d_created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    d_updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT status_master_pkey PRIMARY KEY (n_status_id)
);

-- TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_am_status_master
    OWNER to postgres;

    INSERT INTO public.tbl_am_status_master (
  n_status_id,
  s_status_name,
  s_description,
  d_created_at,
  d_updated_at
)
VALUES
  (1, 'Present', 'User checked in and out properly', NOW(), NOW()),
  (2, 'Absent', 'User did not check in during the working day', NOW(), NOW()),
  (3, 'Half Day', 'User worked for half the required hours', NOW(), NOW()),
  (4, 'Late', 'User checked in after allowed time', NOW(), NOW()),
  (5, 'On Leave', 'User is officially on leave', NOW(), NOW());
