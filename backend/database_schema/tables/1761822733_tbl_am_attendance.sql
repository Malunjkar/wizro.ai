-- SQL file generated
-- Table: public.tbl_am_attendance

-- DROP TABLE IF EXISTS public.tbl_am_attendance;

CREATE SEQUENCE IF NOT EXISTS tbl_am_attendance_n_attendance_id_seq;

CREATE TABLE IF NOT EXISTS public.tbl_am_attendance
(
    n_attendance_id integer NOT NULL DEFAULT nextval('tbl_am_attendance_n_attendance_id_seq'::regclass),
    n_user_id integer NOT NULL,
    t_check_in timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    t_check_out timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    t_work_hrs interval,
    s_work_loc character varying(100) COLLATE pg_catalog."default",
    n_status_id integer,
    d_created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    d_updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tbl_am_attendance_pkey PRIMARY KEY (n_attendance_id),
    CONSTRAINT fk_status FOREIGN KEY (n_status_id)
        REFERENCES public.tbl_am_status_master (n_status_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT fk_user FOREIGN KEY (n_user_id)
        REFERENCES public.tbl_users (n_user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


ALTER TABLE public.tbl_am_attendance 
ALTER COLUMN n_attendance_id 
SET DEFAULT nextval('tbl_am_attendance_n_attendance_id_seq'::regclass);


-- TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_am_attendance
    OWNER to postgres;