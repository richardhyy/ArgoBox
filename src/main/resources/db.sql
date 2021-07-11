CREATE TABLE "argo_bbp" (
  "platform_number" int4 NOT NULL,
  "cycle_number" int4 NOT NULL,
  "pressure" numeric(7,1)[],
  "cpressure" numeric(7,1)[],
  "qpressure" varchar(1)[],
  "backunknown" numeric(12,6)[],
  "cbackunknown" numeric(12,6)[],
  "qbackunknown" varchar(1)[],
  "back470" numeric(12,6)[],
  "cback470" numeric(12,6)[],
  "qback470" varchar(1)[],
  "back532" numeric(12,6)[],
  "cback532" numeric(12,6)[],
  "qback532" varchar(1)[],
  "back700" numeric(12,6)[],
  "cback700" numeric(12,6)[],
  "qback700" varchar(1)[],
  CONSTRAINT "_copy_2_copy_3" PRIMARY KEY ("platform_number", "cycle_number")
);

CREATE TABLE "argo_cdom" (
  "platform_number" int4 NOT NULL,
  "cycle_number" int4 NOT NULL,
  "pressure" numeric(7,1)[],
  "cpressure" numeric(7,1)[],
  "qpressure" varchar(1)[],
  "cdom" numeric(10,4)[],
  "ccdom" numeric(10,4)[],
  "qcdom" varchar(1)[],
  CONSTRAINT "_copy_2_copy_4" PRIMARY KEY ("platform_number", "cycle_number")
);

CREATE TABLE "argo_chla" (
  "platform_number" int4 NOT NULL,
  "cycle_number" int4 NOT NULL,
  "pressure" numeric(7,1)[],
  "cpressure" numeric(7,1)[],
  "qpressure" varchar(1)[],
  "chla" numeric(10,4)[],
  "cchla" numeric(10,4)[],
  "qchla" varchar(1)[],
  CONSTRAINT "_copy_2_copy_5" PRIMARY KEY ("platform_number", "cycle_number")
);

CREATE TABLE "argo_core" (
  "platform_number" int4 NOT NULL,
  "cycle_number" int4 NOT NULL,
  "pressure" numeric(7,1)[],
  "cpressure" numeric(7,1)[],
  "qpressure" varchar(1)[],
  "temperature" numeric(9,3)[],
  "ctemperature" numeric(9,3)[],
  "qtemperature" varchar(1)[],
  "salinity" numeric(9,3)[],
  "csalinity" numeric(9,3)[],
  "qsalinity" varchar(1)[],
  PRIMARY KEY ("platform_number", "cycle_number")
);

CREATE TABLE "argo_doxy" (
  "platform_number" int4 NOT NULL,
  "cycle_number" int4 NOT NULL,
  "pressure" numeric(7,1)[],
  "cpressure" numeric(7,1)[],
  "qpressure" varchar(1)[],
  "tempdoxy" numeric(9,3)[],
  "ctempdoxy" numeric(9,3)[],
  "qtempdoxy" varchar(1)[],
  "doxygen" numeric(9,3)[],
  "cdoxygen" numeric(9,3)[],
  "qdoxygen" varchar(1)[],
  CONSTRAINT "_copy_2_copy_6" PRIMARY KEY ("platform_number", "cycle_number")
);

CREATE TABLE "argo_header" (
  "platform_number" int4 NOT NULL,
  "cycle_number" int4 NOT NULL,
  "date_creation" time,
  "project_name" varchar(255),
  "pi_name" varchar(255),
  "instrument_type" varchar(255),
  "sample_direction" varchar(1),
  "data_mode" varchar(1),
  "julian_day" numeric(255,4),
  "date" date,
  "latitude" numeric(6,3),
  "longitude" numeric(6,3),
  CONSTRAINT "_copy_3" PRIMARY KEY ("platform_number", "cycle_number")
);

CREATE TABLE "argo_irra" (
  "platform_number" int4 NOT NULL,
  "cycle_number" int4 NOT NULL,
  "pressure" numeric(7,1)[],
  "cpressure" numeric(7,1)[],
  "qpressure" varchar(1)[],
  "downirra412" numeric(12,6)[],
  "cdownirra412" numeric(12,6)[],
  "qdownirra412" varchar(1)[],
  "downirra443" numeric(12,6)[],
  "cdownirra443" numeric(12,6)[],
  "qdownirra443" varchar(1)[],
  "downirra490" numeric(12,6)[],
  "cdownirra490" numeric(12,6)[],
  "qdownirra490" varchar(1)[],
  "par" numeric(12,6)[],
  "cpar" numeric(12,6)[],
  "qpar" varchar(1)[],
  CONSTRAINT "_copy_2_copy_2" PRIMARY KEY ("platform_number", "cycle_number")
);

CREATE TABLE "argo_meta" (
  "platform_number" int4 NOT NULL,
  "transmission_id" varchar COLLATE "pg_catalog"."default",
  "transmission_system" varchar COLLATE "pg_catalog"."default",
  "transmission_frequency" float8,
  "transmission_system_id" varchar COLLATE "pg_catalog"."default",
  "positioning_system" varchar COLLATE "pg_catalog"."default",
  "platform_model" varchar COLLATE "pg_catalog"."default",
  "platform_maker" varchar COLLATE "pg_catalog"."default",
  "platform_firmware_version" varchar COLLATE "pg_catalog"."default",
  "float_serial_number" varchar COLLATE "pg_catalog"."default",
  "float_manual_version" varchar COLLATE "pg_catalog"."default",
  "standard_format_id" varchar COLLATE "pg_catalog"."default",
  "dac_fromat_id" varchar COLLATE "pg_catalog"."default",
  "wmo_instrument_type" int4,
  "project_name" varchar COLLATE "pg_catalog"."default",
  "data_centre" varchar COLLATE "pg_catalog"."default",
  "pi_name" varchar COLLATE "pg_catalog"."default",
  "startup_date" timestamp(6),
  "launch_date" timestamp(6),
  "launch_latitude" float8,
  "launch_longitude" float8,
  "deployment_platform" varchar COLLATE "pg_catalog"."default",
  "deployment_cruise_id" varchar COLLATE "pg_catalog"."default",
  "sensors" varchar COLLATE "pg_catalog"."default",
  "sensor_maker" varchar COLLATE "pg_catalog"."default",
  "sensor_model" varchar COLLATE "pg_catalog"."default",
  "sensor_serial_number" varchar COLLATE "pg_catalog"."default",
  "sensor_units" varchar COLLATE "pg_catalog"."default",
  "sensor_accuracy" varchar COLLATE "pg_catalog"."default",
  "sensor_resolution" varchar COLLATE "pg_catalog"."default",
  "cycle_time" float8,
  "down_time" float8,
  "up_time" float8,
  "parking_time" float8,
  "descent_profiling_time" float8,
  "ascent_profiling_time" float8,
  "park_pressure" int4,
  "profile_pressure" int4,
  "creation_date" timestamp(6),
  "update_date" timestamp(6),
  CONSTRAINT "argo_meta_pkey" PRIMARY KEY ("platform_number")
);
ALTER TABLE "argo_meta" OWNER TO "postgres";

CREATE TABLE "argo_nitr" (
  "platform_number" int4 NOT NULL,
  "cycle_number" int4 NOT NULL,
  "pressure" numeric(7,1)[],
  "cpressure" numeric(7,1)[],
  "qpressure" varchar(1)[],
  "nitrate" numeric(9,3)[],
  "cnitrate" numeric(9,3)[],
  "qnitrate" varchar(1)[],
  CONSTRAINT "_copy_2_copy_1" PRIMARY KEY ("platform_number", "cycle_number")
);

CREATE TABLE "argo_ph" (
  "platform_number" int4 NOT NULL,
  "cycle_number" int4 NOT NULL,
  "pressure" numeric(7,1)[],
  "cpressure" numeric(7,1)[],
  "qpressure" varchar(1)[],
  "ph" numeric(10,4)[],
  "cph" numeric(10,4)[],
  "qph" varchar(1)[],
  CONSTRAINT "_copy_2" PRIMARY KEY ("platform_number", "cycle_number")
);

