--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.1

-- Started on 2024-04-01 14:12:15 PST

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3418 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16448)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    transaction_no character varying,
    amount bigint,
    dt_created timestamp without time zone DEFAULT now(),
    session_id integer,
    remarks text
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16447)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq OWNER TO postgres;

--
-- TOC entry 3419 (class 0 OID 0)
-- Dependencies: 222
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 215 (class 1259 OID 16388)
-- Name: rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rates (
    rate_id smallint NOT NULL,
    name character varying(50) NOT NULL,
    garage text NOT NULL,
    no_garage text NOT NULL,
    dt_created timestamp without time zone DEFAULT now(),
    dt_updated timestamp without time zone DEFAULT now(),
    deleted boolean DEFAULT false
);


ALTER TABLE public.rates OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16395)
-- Name: rates_rate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rates_rate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rates_rate_id_seq OWNER TO postgres;

--
-- TOC entry 3420 (class 0 OID 0)
-- Dependencies: 216
-- Name: rates_rate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rates_rate_id_seq OWNED BY public.rates.rate_id;


--
-- TOC entry 217 (class 1259 OID 16396)
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    room_no smallint NOT NULL,
    type character varying(50) NOT NULL,
    transaction_no character varying(50),
    status smallint
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16481)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    session_id integer NOT NULL,
    user_id integer,
    login_dt timestamp with time zone DEFAULT now(),
    logout_dt timestamp with time zone
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16480)
-- Name: sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sessions_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_session_id_seq OWNER TO postgres;

--
-- TOC entry 3421 (class 0 OID 0)
-- Dependencies: 224
-- Name: sessions_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sessions_session_id_seq OWNED BY public.sessions.session_id;


--
-- TOC entry 218 (class 1259 OID 16399)
-- Name: transaction_ref_no_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_ref_no_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_ref_no_seq OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16400)
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    transaction_no character varying(50) DEFAULT format('TRN%s'::text, lpad((nextval('public.transaction_ref_no_seq'::regclass))::text, 10, '0'::text)) NOT NULL,
    room_no smallint NOT NULL,
    dt_check_in timestamp with time zone DEFAULT now(),
    dt_check_out timestamp with time zone,
    bill bigint,
    duration smallint,
    base_time smallint,
    additional_time smallint,
    rate_id smallint,
    remarks text
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16407)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16408)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    admin boolean DEFAULT false,
    dt_created timestamp without time zone DEFAULT now(),
    dt_updated timestamp without time zone DEFAULT now(),
    deleted boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3238 (class 2604 OID 16451)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 3227 (class 2604 OID 16426)
-- Name: rates rate_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rates ALTER COLUMN rate_id SET DEFAULT nextval('public.rates_rate_id_seq'::regclass);


--
-- TOC entry 3240 (class 2604 OID 16484)
-- Name: sessions session_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions ALTER COLUMN session_id SET DEFAULT nextval('public.sessions_session_id_seq'::regclass);


--
-- TOC entry 3410 (class 0 OID 16448)
-- Dependencies: 223
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, transaction_no, amount, dt_created, session_id, remarks) FROM stdin;
\.


--
-- TOC entry 3402 (class 0 OID 16388)
-- Dependencies: 215
-- Data for Name: rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rates (rate_id, name, garage, no_garage, dt_created, dt_updated, deleted) FROM stdin;
1	Default	{"hourly":"100","three":"300","six":"500","twelve":"900","twenty_four":"1200"}	{"hourly":"100","three":"250","six":"450","twelve":"700","twenty_four":"1000"}	2023-04-10 19:08:41.292715	2023-06-19 23:23:57.823366	f
3	Senior Discount	{"three":"240","six":"400","twelve":"640","twenty_four":"960","hourly":"80"}	{"three":"200","six":"360","twelve":"560","twenty_four":"800","hourly":"80"}	2023-04-12 18:46:07.957377	2023-04-12 18:46:07.957377	f
2	KCC Discount	{"hourly":"90","three":"270","six":"450","twelve":"720","twenty_four":"1080"}	{"hourly":"90","three":"180","six":"405","twelve":"540","twenty_four":"810"}	2023-04-12 18:36:32.546515	2023-07-24 23:17:51.218751	f
\.


--
-- TOC entry 3404 (class 0 OID 16396)
-- Dependencies: 217
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (room_no, type, transaction_no, status) FROM stdin;
131	no_garage	\N	1
135	no_garage	\N	1
255	no_garage	\N	1
115	garage	\N	1
128	no_garage	\N	1
129	no_garage	\N	1
130	no_garage	\N	1
259	no_garage	\N	1
260	no_garage	\N	1
267	no_garage	\N	1
133	no_garage	\N	1
142	no_garage	\N	1
138	no_garage	\N	1
117	garage	\N	1
134	no_garage	\N	1
136	no_garage	\N	1
137	no_garage	\N	1
139	no_garage	\N	1
141	no_garage	\N	1
143	no_garage	\N	1
244	no_garage	\N	1
245	no_garage	\N	1
246	no_garage	\N	1
247	no_garage	\N	1
248	no_garage	\N	1
249	no_garage	\N	1
250	no_garage	\N	1
251	no_garage	\N	1
252	no_garage	\N	1
116	garage	\N	1
253	no_garage	\N	1
254	no_garage	\N	1
256	no_garage	\N	1
257	no_garage	\N	1
258	no_garage	\N	1
261	no_garage	\N	1
262	no_garage	\N	1
263	no_garage	\N	1
264	no_garage	\N	1
266	no_garage	\N	1
268	no_garage	\N	1
118	garage	\N	1
140	no_garage	\N	1
124	garage	\N	1
120	garage	\N	1
119	garage	\N	1
121	garage	\N	1
122	garage	\N	1
123	garage	\N	1
125	garage	\N	1
126	garage	\N	1
265	no_garage	\N	1
127	garage	\N	1
132	no_garage	\N	1
106	garage	\N	1
105	garage	\N	1
107	garage	\N	1
114	garage	\N	1
113	garage	\N	1
112	garage	\N	1
111	garage	\N	1
110	garage	\N	1
109	garage	\N	1
108	garage	\N	1
104	garage	\N	1
103	garage	\N	1
102	garage	\N	1
101	garage	\N	1
\.


--
-- TOC entry 3412 (class 0 OID 16481)
-- Dependencies: 225
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (session_id, user_id, login_dt, logout_dt) FROM stdin;
\.


--
-- TOC entry 3406 (class 0 OID 16400)
-- Dependencies: 219
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (transaction_no, room_no, dt_check_in, dt_check_out, bill, duration, base_time, additional_time, rate_id, remarks) FROM stdin;
\.


--
-- TOC entry 3408 (class 0 OID 16408)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, username, password, admin, dt_created, dt_updated, deleted) FROM stdin;
1	admin	admin	admin	1234	t	2024-03-09 06:42:33.208784	2024-03-09 06:42:33.208784	f
\.


--
-- TOC entry 3422 (class 0 OID 0)
-- Dependencies: 222
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 1, false);


--
-- TOC entry 3423 (class 0 OID 0)
-- Dependencies: 216
-- Name: rates_rate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rates_rate_id_seq', 4, false);


--
-- TOC entry 3424 (class 0 OID 0)
-- Dependencies: 224
-- Name: sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sessions_session_id_seq', 1, false);


--
-- TOC entry 3425 (class 0 OID 0)
-- Dependencies: 218
-- Name: transaction_ref_no_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_ref_no_seq', 1, false);


--
-- TOC entry 3426 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, false);


--
-- TOC entry 3253 (class 2606 OID 16456)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 3243 (class 2606 OID 16417)
-- Name: rates rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rates
    ADD CONSTRAINT rates_pkey PRIMARY KEY (rate_id);


--
-- TOC entry 3245 (class 2606 OID 16419)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (room_no);


--
-- TOC entry 3255 (class 2606 OID 16487)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_id);


--
-- TOC entry 3247 (class 2606 OID 16421)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_no);


--
-- TOC entry 3249 (class 2606 OID 16423)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3251 (class 2606 OID 16425)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3256 (class 2606 OID 16494)
-- Name: payments payments_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(session_id);


--
-- TOC entry 3257 (class 2606 OID 16457)
-- Name: payments payments_transaction_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_no_fkey FOREIGN KEY (transaction_no) REFERENCES public.transactions(transaction_no);


--
-- TOC entry 3258 (class 2606 OID 16488)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2024-04-01 14:12:15 PST

--
-- PostgreSQL database dump complete
--

