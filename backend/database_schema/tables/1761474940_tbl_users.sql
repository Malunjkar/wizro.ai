-- Table: public.tbl_users

-- DROP TABLE IF EXISTS public.tbl_users;

CREATE TABLE IF NOT EXISTS public.tbl_users
(
    n_user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    s_full_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    s_email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    s_password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    n_role smallint NOT NULL,
    n_status smallint DEFAULT 1,
    n_created_by smallint,
    d_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    d_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_email_key UNIQUE (s_email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_users OWNER to postgres;

-- Data: public.tbl_users

INSERT INTO public.tbl_users(s_full_name, s_email, s_password, n_role, n_status, n_created_by)
VALUES ('admin', 'admin@kosqu.com', '$2b$10$5aWafvB6q2kX6eQrdCJd3uGt72Z1Thf6h9w2zJ6vrwjIMKdxlXbZu', 1, 1, 0),
('project manager', 'pm@kosqu.com', '$2b$10$B5xugUmrUWOAu/qUDQGO7.JpE4Qu.v7UFmP1i4IIXBE1Y4jRnDem2', 2, 1, 0),
('Emp 1', 'emp1@kosqu.com', '$2b$10$o9q/9k/jJGg3VNkTVtqRSurr3REW9r0MY.2AM5ZgtXRIaP6gl7kDa', 3, 1, 0),
('Emp 2', 'emp2@kosqu.com', '$2b$10$nTvwgrTwHwk3MxwnqijKl.W1xJpNo/Dpfzl5y8dYxfaLLP2LVhqya', 3, 1, 0),
('hr','hr@kosqu.com','$2b$10$PR7pfWajI50YY7/jt24SVeGw/Twz.jejkMDeCDnJm7hvOCCmKm0Im',4,1,0);
