CREATE TABLE IF NOT EXISTS public.cars
(
    id serial,
    car_number character varying(100) NOT NULL,
    car_name character varying(100) NOT NULL,
    CONSTRAINT car_pkey PRIMARY KEY (id)
);

INSERT INTO cars (car_number, car_name) VALUES
('Т894СЕ', 'Toyota camry'),
('П123УН', 'Toyota camry'),
('А817МE', 'Toyota camry'),
('И579РН', 'Toyota camry'),
('О964CГ', 'Toyota camry');

CREATE TABLE IF NOT EXISTS public.rent
(
    id serial,
    car_id integer references cars NOT NULL,
	start_session timestamp with time zone NOT NULL,
	end_session timestamp with time zone NOT NULL,
	price integer NOT NULL,
    CONSTRAINT rent_pkey PRIMARY KEY (id)
);

INSERT INTO rent (car_id, start_session, end_session, price) VALUES
(1, '2021-10-31', '2021-11-01', 2000),
(1, '2021-11-05', '2021-11-08', 4000),
(2, '2021-11-01', '2021-11-04', 4000),
(1, '2021-11-12', '2021-11-19', 7800),
(1, '2021-11-23', '2021-12-13', 19350),
(3, '2021-11-01', '2021-11-04', 4000);

CREATE TABLE IF NOT EXISTS public.tariffs
(
    id serial,
    start_date integer NOT NULL,
    end_date integer NOT NULL,
    percent_sale integer NOT NULL,
    CONSTRAINT tariff_pkey PRIMARY KEY (id)
);

INSERT INTO tariffs (start_date, end_date, percent_sale) VALUES
(5, 9, 5),
(10, 17, 10),
(18, 29, 15);

CREATE TABLE IF NOT EXISTS public.prices
(
    id serial,
    price integer NOT NULL,
    alias VARCHAR (50) NOT NULL,
    CONSTRAINT prices_pkey PRIMARY KEY (id),
    UNIQUE(alias)
);

INSERT INTO prices (price, alias) VALUES
(1000, 'base_tariff');