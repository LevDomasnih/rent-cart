CREATE TABLE IF NOT EXISTS public.car
(
    id serial,
    car_number character varying(100),
    car_name character varying(100),
    CONSTRAINT car_pkey PRIMARY KEY (id)
);

INSERT INTO car (car_number, car_name) VALUES
('Т894СЕ', 'Toyota camry'),
('П123УН', 'Toyota camry'),
('А817МE', 'Toyota camry'),
('И579РН', 'Toyota camry'),
('О964CГ', 'Toyota camry');

CREATE TABLE IF NOT EXISTS public.rent
(
    id serial,
    car_id integer references car NOT NULL,
	start_session timestamp with time zone NOT NULL,
	end_session timestamp with time zone NOT NULL,
	price integer,
    CONSTRAINT rent_pkey PRIMARY KEY (id)
);

INSERT INTO rent (car_id, start_session, end_session, price) VALUES
(1, '2019-10-01', '2019-10-10', 18800),
(2, '2019-10-15', '2019-10-15', 18800),
(1, '2019-10-15', '2019-10-18', 18800),
(1, '2019-10-22', '2019-10-30', 18800),
(3, '2019-10-15', '2019-10-15', 18800);