-- Table: public.tbl_role_master

DROP TABLE IF EXISTS public.tbl_role_master;

CREATE TABLE IF NOT EXISTS public.tbl_role_master
(
    n_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    s_role_name VARCHAR(45) NOT NULL
);

ALTER TABLE public.tbl_role_master OWNER TO postgres;

-- Data: public.tbl_role_master
INSERT INTO public.tbl_role_master (s_role_name)
VALUES 
  ('admin'),
  ('project manager'),
  ('emp'),
  ('hr');
