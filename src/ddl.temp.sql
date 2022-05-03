
        --
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Debian 13.2-1.pgdg100+1)
-- Dumped by pg_dump version 13.2 (Debian 13.2-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: car_fuel_type_simplified_enum; Type: TYPE; Schema: public; Owner: fc_dev_admin
--

CREATE TYPE public.car_fuel_type_simplified_enum AS ENUM (
    'PETROL',
    'DIESEL',
    'LPG',
    'ELECTRIC',
    'OTHER'
);


ALTER TYPE public.car_fuel_type_simplified_enum OWNER TO fc_dev_admin;

--
-- Name: emission_event_source_type_enum; Type: TYPE; Schema: public; Owner: fc_dev_admin
--

CREATE TYPE public.emission_event_source_type_enum AS ENUM (
    'TRANSACTION'
);


ALTER TYPE public.emission_event_source_type_enum OWNER TO fc_dev_admin;

--
-- Name: user_bank_connection_requisition_status_enum; Type: TYPE; Schema: public; Owner: fc_dev_admin
--

CREATE TYPE public.user_bank_connection_requisition_status_enum AS ENUM (
    'preinitial',
    'initial',
    'valid',
    'broken',
    'deleted',
    'expired'
);


ALTER TYPE public.user_bank_connection_requisition_status_enum OWNER TO fc_dev_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bank; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE public.bank (
    id character varying NOT NULL,
    name character varying NOT NULL,
    provider character varying NOT NULL,
    bic character varying NOT NULL,
    logo character varying NOT NULL,
    transaction_total_days integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.bank OWNER TO fc_dev_admin;

--
-- Name: car; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE public.car (
    id integer NOT NULL,
    license_plate character varying NOT NULL,
    brand character varying NOT NULL,
    type character varying NOT NULL,
    build_year character varying NOT NULL,
    fuel_types character varying NOT NULL,
    fuel_type_simplified public.car_fuel_type_simplified_enum,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.car OWNER TO fc_dev_admin;

--
-- Name: car_id_seq; Type: SEQUENCE; Schema: public; Owner: fc_dev_admin
--

CREATE SEQUENCE public.car_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.car_id_seq OWNER TO fc_dev_admin;

--
-- Name: car_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fc_dev_admin
--

ALTER SEQUENCE public.car_id_seq OWNED BY public.car.id;


--
-- Name: emission_event; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE public.emission_event (
    id integer NOT NULL,
    co2eq_mean real NOT NULL,
    co2eq_min real,
    co2eq_max real,
    source_type public.emission_event_source_type_enum NOT NULL,
    source_id character varying NOT NULL,
    data json NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.emission_event OWNER TO fc_dev_admin;

--
-- Name: emission_event_id_seq; Type: SEQUENCE; Schema: public; Owner: fc_dev_admin
--

CREATE SEQUENCE public.emission_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.emission_event_id_seq OWNER TO fc_dev_admin;

--
-- Name: emission_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fc_dev_admin
--

ALTER SEQUENCE public.emission_event_id_seq OWNED BY public.emission_event.id;


--
-- Name: merchant; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE public.merchant (
    id integer NOT NULL,
    name character varying NOT NULL,
    website character varying,
    logo character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    category_id integer
);


ALTER TABLE public.merchant OWNER TO fc_dev_admin;

--
-- Name: merchant_account; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE public.merchant_account (
    iban character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    merchant_id integer NOT NULL
);


ALTER TABLE public.merchant_account OWNER TO fc_dev_admin;

--
-- Name: merchant_category; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE public.merchant_category (
    id integer NOT NULL,
    label character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.merchant_category OWNER TO fc_dev_admin;

--
-- Name: merchant_category_id_seq; Type: SEQUENCE; Schema: public; Owner: fc_dev_admin
--

CREATE SEQUENCE public.merchant_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.merchant_category_id_seq OWNER TO fc_dev_admin;

--
-- Name: merchant_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fc_dev_admin
--

ALTER SEQUENCE public.merchant_category_id_seq OWNED BY public.merchant_category.id;


--
-- Name: merchant_id_seq; Type: SEQUENCE; Schema: public; Owner: fc_dev_admin
--

CREATE SEQUENCE public.merchant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.merchant_id_seq OWNER TO fc_dev_admin;

--
-- Name: merchant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fc_dev_admin
--

ALTER SEQUENCE public.merchant_id_seq OWNED BY public.merchant.id;


--
-- Name: merchant_pattern; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE public.merchant_pattern (
    name character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    merchant_id integer NOT NULL
);


ALTER TABLE public.merchant_pattern OWNER TO fc_dev_admin;

--
-- Name: transaction; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE public.transaction (
    id character varying NOT NULL,
    processed boolean NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    bank_connection_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.transaction OWNER TO fc_dev_admin;

--
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE IF NOT EXISTS public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO fc_dev_admin;

--
-- Name: user; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying NOT NULL,
    name character varying,
    active boolean DEFAULT true NOT NULL,
    onboarding_data json,
    journey_data json,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO fc_dev_admin;

--
-- Name: user_bank_connection; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE public.user_bank_connection (
    id integer NOT NULL,
    provider character varying DEFAULT 'nordigen'::character varying NOT NULL,
    requisition_data jsonb NOT NULL,
    requisition_status public.user_bank_connection_requisition_status_enum DEFAULT 'preinitial'::public.user_bank_connection_requisition_status_enum NOT NULL,
    requisition_expires_at timestamp without time zone,
    account_details_data jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    bank_id character varying NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.user_bank_connection OWNER TO fc_dev_admin;

--
-- Name: user_bank_connection_id_seq; Type: SEQUENCE; Schema: public; Owner: fc_dev_admin
--

CREATE SEQUENCE public.user_bank_connection_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_bank_connection_id_seq OWNER TO fc_dev_admin;

--
-- Name: user_bank_connection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fc_dev_admin
--

ALTER SEQUENCE public.user_bank_connection_id_seq OWNED BY public.user_bank_connection.id;


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: fc_dev_admin
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO fc_dev_admin;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fc_dev_admin
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: user_otp; Type: TABLE; Schema: public; Owner: fc_dev_admin
--

CREATE TABLE public.user_otp (
    id integer NOT NULL,
    otp_hashed character varying NOT NULL,
    used boolean NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.user_otp OWNER TO fc_dev_admin;

--
-- Name: user_otp_id_seq; Type: SEQUENCE; Schema: public; Owner: fc_dev_admin
--

CREATE SEQUENCE public.user_otp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_otp_id_seq OWNER TO fc_dev_admin;

--
-- Name: user_otp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fc_dev_admin
--

ALTER SEQUENCE public.user_otp_id_seq OWNED BY public.user_otp.id;


--
-- Name: car id; Type: DEFAULT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.car ALTER COLUMN id SET DEFAULT nextval('public.car_id_seq'::regclass);


--
-- Name: emission_event id; Type: DEFAULT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.emission_event ALTER COLUMN id SET DEFAULT nextval('public.emission_event_id_seq'::regclass);


--
-- Name: merchant id; Type: DEFAULT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.merchant ALTER COLUMN id SET DEFAULT nextval('public.merchant_id_seq'::regclass);


--
-- Name: merchant_category id; Type: DEFAULT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.merchant_category ALTER COLUMN id SET DEFAULT nextval('public.merchant_category_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: user_bank_connection id; Type: DEFAULT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.user_bank_connection ALTER COLUMN id SET DEFAULT nextval('public.user_bank_connection_id_seq'::regclass);


--
-- Name: user_otp id; Type: DEFAULT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.user_otp ALTER COLUMN id SET DEFAULT nextval('public.user_otp_id_seq'::regclass);


--
-- Name: merchant_category PK_193eb59c92e574470923f86c469; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.merchant_category
    ADD CONSTRAINT "PK_193eb59c92e574470923f86c469" PRIMARY KEY (id);


--
-- Name: merchant_pattern PK_2d1d64066dbcdd7a3dcb6fd35b4; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.merchant_pattern
    ADD CONSTRAINT "PK_2d1d64066dbcdd7a3dcb6fd35b4" PRIMARY KEY (name);


--
-- Name: user_otp PK_494c022ed33e6ee19a2bbb11b22; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.user_otp
    ADD CONSTRAINT "PK_494c022ed33e6ee19a2bbb11b22" PRIMARY KEY (id);


--
-- Name: car PK_55bbdeb14e0b1d7ab417d11ee6d; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.car
    ADD CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY (id);


--
-- Name: merchant_account PK_55e113831dfbd88b09fa0c545e0; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.merchant_account
    ADD CONSTRAINT "PK_55e113831dfbd88b09fa0c545e0" PRIMARY KEY (iban);


--
-- Name: user_bank_connection PK_6532841394584ab90eea644e14f; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.user_bank_connection
    ADD CONSTRAINT "PK_6532841394584ab90eea644e14f" PRIMARY KEY (id);


--
-- Name: bank PK_7651eaf705126155142947926e8; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT "PK_7651eaf705126155142947926e8" PRIMARY KEY (id);


--
-- Name: transaction PK_89eadb93a89810556e1cbcd6ab9; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY (id);


--
-- Name: merchant PK_9a3850e0537d869734fc9bff5d6; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.merchant
    ADD CONSTRAINT "PK_9a3850e0537d869734fc9bff5d6" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: emission_event PK_f1038c517cb32e7aa0d02a494cc; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.emission_event
    ADD CONSTRAINT "PK_f1038c517cb32e7aa0d02a494cc" PRIMARY KEY (id);


--
-- Name: user_otp REL_7c4b83e0619128a0b57da32228; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.user_otp
    ADD CONSTRAINT "REL_7c4b83e0619128a0b57da32228" UNIQUE (user_id);


--
-- Name: car UQ_f42aabf22b97fcdd469d7b23180; Type: CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.car
    ADD CONSTRAINT "UQ_f42aabf22b97fcdd469d7b23180" UNIQUE (license_plate, user_id);


--
-- Name: emission_event FK_01afe6ce90727b320e3e30bc9a0; Type: FK CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.emission_event
    ADD CONSTRAINT "FK_01afe6ce90727b320e3e30bc9a0" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: merchant FK_193eb59c92e574470923f86c469; Type: FK CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.merchant
    ADD CONSTRAINT "FK_193eb59c92e574470923f86c469" FOREIGN KEY (category_id) REFERENCES public.merchant_category(id);


--
-- Name: user_bank_connection FK_5391404a7ab68c61d03687faefb; Type: FK CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.user_bank_connection
    ADD CONSTRAINT "FK_5391404a7ab68c61d03687faefb" FOREIGN KEY (bank_id) REFERENCES public.bank(id);


--
-- Name: user_otp FK_7c4b83e0619128a0b57da32228c; Type: FK CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.user_otp
    ADD CONSTRAINT "FK_7c4b83e0619128a0b57da32228c" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: user_bank_connection FK_a8d9ad4a514be1a2e1448a5c0a0; Type: FK CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.user_bank_connection
    ADD CONSTRAINT "FK_a8d9ad4a514be1a2e1448a5c0a0" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: transaction FK_b04bbdf04d9ffd5a6e3edabd7fe; Type: FK CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "FK_b04bbdf04d9ffd5a6e3edabd7fe" FOREIGN KEY (bank_connection_id) REFERENCES public.user_bank_connection(id);


--
-- Name: transaction FK_b4a3d92d5dde30f3ab5c34c5862; Type: FK CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "FK_b4a3d92d5dde30f3ab5c34c5862" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: car FK_c8d34198d86de9e96aae03b8990; Type: FK CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.car
    ADD CONSTRAINT "FK_c8d34198d86de9e96aae03b8990" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: merchant_account FK_ef40c24a24ca7adf78e851cb478; Type: FK CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.merchant_account
    ADD CONSTRAINT "FK_ef40c24a24ca7adf78e851cb478" FOREIGN KEY (merchant_id) REFERENCES public.merchant(id);


--
-- Name: merchant_pattern FK_fe9071889b5370bcc96f725ed63; Type: FK CONSTRAINT; Schema: public; Owner: fc_dev_admin
--

ALTER TABLE ONLY public.merchant_pattern
    ADD CONSTRAINT "FK_fe9071889b5370bcc96f725ed63" FOREIGN KEY (merchant_id) REFERENCES public.merchant(id);

