CREATE TYPE "status" AS ENUM (
  'Pendiente',
  'En curso',
  'Finalizado',
  'Validado'
);

CREATE TYPE "gender" AS ENUM (
  'Femenino',
  'Masculino',
  'No Binario',
  'Otro'
);

CREATE TYPE "labtest_type" AS ENUM (
  'Simple',
  'Compuesto'
);

CREATE TYPE "sample_type" AS ENUM (
  'Sangre',
  'Orina',
  'Flujo Vaginal',
  'Semen',
  'Saliba'
);

CREATE TYPE "resistencia" AS ENUM (
  'Baja',
  'Media',
  'Alta',
  'Otro'
);

CREATE TABLE "HealthcareProvider" (
  "id" INT PRIMARY KEY,
  "name" VARCHAR(120),
  "is_active" BOOL
);

CREATE TABLE "Patient" (
  "id" INT PRIMARY KEY,
  "name" VARCHAR(120),
  "surname" VARCHAR(120),
  "id_type" VARCHAR(120),
  "id_number" INT,
  "birthday" date,
  "age" gender,
  "gender" VARCHAR(120),
  "healthcare_provider" INT,
  "healthcareprovider_id" VARCHAR(120),
  "phone_number" VARCHAR(120),
  "address" VARCHAR(120),
  "email" email,
  "is_active" BOOL
);

CREATE TABLE "Doctor" (
  "id" INT PRIMARY KEY,
  "name" VARCHAR(120),
  "surname" VARCHAR(120),
  "license_number" VARCHAR(120),
  "specialty" VARCHAR(120),
  "full_info" VARCHAR(120),
  "is_active" BOOL
);

CREATE TABLE "LabTestGroup" (
  "id" INT PRIMARY KEY,
  "name" VARCHAR(120),
  "is_active" BOOL
);

CREATE TABLE "LabTest" (
  "id" INT PRIMARY KEY,
  "code" VARCHAR(120),
  "ub" VARCHAR(120),
  "method" VARCHAR(120),
  "price" VARCHAR(120),
  "group_id" INT,
  "test_type" labtest_type,
  "sample_type" INT,
  "has_ref_val" BOOL,
  "is_active" BOOL
);

CREATE TABLE "LabTestComponent" (
  "id" INT PRIMARY KEY,
  "labtest_id" INT,
  "name" VARCHAR(120),
  "unit" VARCHAR(120),
  "reference_value" VARCHAR(120),
  "is_active" BOOL
);

CREATE TABLE "LabTest_Child" (
  "id" INT PRIMARY KEY,
  "code" VARCHAR(120),
  "name" VARCHAR(120),
  "ub" VARCHAR(120),
  "method" VARCHAR(120),
  "price" VARCHAR(120),
  "group_id" INT,
  "sample_type" INT,
  "test_type" labtest_type,
  "parent" INT,
  "es_cultivo" BOOL,
  "has_ref_val" BOOL,
  "unit" VARCHAR(120),
  "reference_value" VARCHAR(120),
  "is_active" BOOL
);

CREATE TABLE "LabTest_Parent" (
  "id" INT PRIMARY KEY,
  "code" VARCHAR(120),
  "name" VARCHAR(120),
  "ub" VARCHAR(120),
  "method" VARCHAR(120),
  "price" VARCHAR(120),
  "group_id" INT,
  "sample_type" INT,
  "test_type" labtest_type,
  "parent" INT,
  "es_cultivo" BOOL,
  "has_ref_val" BOOL,
  "unit" VARCHAR(120),
  "reference_value" VARCHAR(120),
  "is_active" BOOL
);

CREATE TABLE "LabTest_Autoref" (
  "id" INT PRIMARY KEY,
  "code" VARCHAR(120),
  "name" VARCHAR(120),
  "ub" VARCHAR(120),
  "method" VARCHAR(120),
  "price" VARCHAR(120),
  "group_id" INT,
  "sample_type" INT,
  "test_type" labtest_type,
  "parent" INT,
  "es_cultivo" BOOL,
  "has_ref_val" BOOL,
  "unit" VARCHAR(120),
  "reference_value" VARCHAR(120),
  "is_active" BOOL
);

CREATE TABLE "Protocol" (
  "id" INT PRIMARY KEY,
  "patient_id" INT,
  "doctor_id" INT,
  "user_id" INT,
  "lab_id" INT,
  "status" status,
  "healthcare_provider" VARCHAR(120),
  "healthcareprovider_id" VARCHAR(120),
  "authorization_number" VARCHAR(120),
  "tiene_cultivos" BOOL,
  "diagnostic" VARCHAR(120),
  "observations" VARCHAR(120),
  "timestamp" datetime,
  "extraction_time(?)" datetime,
  "checkin_time(?)" datetime,
  "validation_time" datetime,
  "is_active" BOOL
);

CREATE TABLE "LabTestReport" (
  "id" INT PRIMARY KEY,
  "protocol_id" INT,
  "labtest_id" INT,
  "status" status,
  "sample_type(?)" sample_type,
  "observations" VARCHAR(1024),
  "timestamp" datetime,
  "test_time" datetime,
  "is_active" BOOL
);

CREATE TABLE "LabComponentReport" (
  "id" INT PRIMARY KEY,
  "labtestreport_id" INT,
  "labtestcomponent_id" INT,
  "value" VARCHAR(120),
  "status" status,
  "timestamp" datetime,
  "test_time" datetime,
  "is_active" BOOL
);

CREATE TABLE "LabTestResult" (
  "id" INT PRIMARY KEY,
  "protocol_id" INT,
  "labtest" INT,
  "labtest_parent" INT,
  "value" VARCHAR(120),
  "status" status,
  "observations" VARCHAR(1024),
  "timestamp" datetime,
  "test_time" datetime,
  "is_active" BOOL
);

CREATE TABLE "CustomUser" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "name" VARCHAR(120),
  "password" VARCHAR(128) NOT NULL,
  "image" image,
  "first_name" VARCHAR(30) NOT NULL,
  "last_name" VARCHAR(150) NOT NULL,
  "is_staff" BOOL NOT NULL,
  "is_active" BOOL NOT NULL,
  "is_superuser" BOOL NOT NULL,
  "last_login" datetime,
  "date_joined" datetime NOT NULL
);

CREATE TABLE "Permission1" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(120)
);

CREATE TABLE "Permission2" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(120)
);

CREATE TABLE "LabUserTypePermissions" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "labusertype_id" INT,
  "permission_id" INT
);

CREATE TABLE "LabMemberPermissions" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "labmember_id" INT,
  "permission_id" INT
);

CREATE TABLE "Lab" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(120),
  "address" VARCHAR(120),
  "email" VARCHAR(120),
  "phone" VARCHAR(120),
  "URL" VARCHAR(120),
  "profile_pic" image,
  "is_active" BOOL
);

CREATE TABLE "LabsMembers" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "user_id" INT,
  "lab_id" INT,
  "type" INT,
  "is_active" BOOL
);

CREATE TABLE "LabUserType" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "type" INT,
  "lab_id" INT,
  "permissions" INT,
  "is_active" BOOL
);

CREATE TABLE "Sample" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "protocol_id" INT,
  "type" INT,
  "received" BOOL,
  "checkin_time" datetime,
  "timestamp" datetime,
  "is_active" BOOL
);

CREATE TABLE "SampleType" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "type" INT,
  "is_active" BOOL
);

CREATE TABLE "None" (
  "Null" SERIAL PRIMARY KEY NOT NULL
);

CREATE TABLE "Cultivos" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "protocol_id" INT,
  "labtest_id" INT,
  "medicamento" VARCHAR(100),
  "resistencia" resistencia,
  "is_active" BOOL
);

COMMENT ON TABLE "Protocol" IS 'Protocol / Report';

COMMENT ON TABLE "LabTestReport" IS '*** LabTest-List asked in a Protocol ***

1) Se podrían juntar ambas tablas:
  LabTestReport
  LabComponentReport
*Ver LabTestResult

2) Se podría eliminar la referencia entre:
  LabTestReport
  LabTest_Parent';

COMMENT ON TABLE "LabTestResult" IS '*** LabTest-List asked in a Protocol ***

1) Se podrían juntar ambas tablas:
  LabTestReport
  LabComponentReport
*Ver LabTestResult

2) Se podría eliminar la referencia entre:
  LabTestReport
  LabTest_Parent';

COMMENT ON TABLE "Sample" IS '¿Incluir referencia a Paciente?
pk: id o protocol_id-##';

ALTER TABLE "Cultivo" ADD FOREIGN KEY ("protocol_id") REFERENCES "Protocol" ("id");

ALTER TABLE "Cultivo" ADD FOREIGN KEY ("labtest_id") REFERENCES "LabTest_Parent" ("id");

ALTER TABLE "Sample" ADD FOREIGN KEY ("protocol_id") REFERENCES "Protocol" ("id");

ALTER TABLE "Sample" ADD FOREIGN KEY ("type") REFERENCES "SampleType" ("id");

--ALTER TABLE "LabTest" ADD FOREIGN KEY ("sample_type") REFERENCES "SampleType" ("id");

ALTER TABLE "LabTest_Parent" ADD FOREIGN KEY ("sample_type") REFERENCES "SampleType" ("id");

--ALTER TABLE "LabTest" ADD FOREIGN KEY ("group_id") REFERENCES "LabTestGroup" ("id");

ALTER TABLE "LabTest_Parent" ADD FOREIGN KEY ("group_id") REFERENCES "LabTestGroup" ("id");

--ALTER TABLE "LabTestComponent" ADD FOREIGN KEY ("labtest_id") REFERENCES "LabTest" ("id");

ALTER TABLE "LabTest_Child" ADD FOREIGN KEY ("parent") REFERENCES "LabTest_Parent" ("id");

ALTER TABLE "LabTest_Parent" ADD FOREIGN KEY ("parent") REFERENCES "None" ("Null");

ALTER TABLE "LabTest_Autoref" ADD FOREIGN KEY ("parent") REFERENCES "LabTest_Autoref" ("id");

ALTER TABLE "Protocol" ADD FOREIGN KEY ("patient_id") REFERENCES "Patient" ("id");

ALTER TABLE "Protocol" ADD FOREIGN KEY ("doctor_id") REFERENCES "Doctor" ("id");

ALTER TABLE "Protocol" ADD FOREIGN KEY ("user_id") REFERENCES "CustomUser" ("id");

ALTER TABLE "LabTestReport" ADD FOREIGN KEY ("protocol_id") REFERENCES "Protocol" ("id");

--ALTER TABLE "LabTestReport" ADD FOREIGN KEY ("labtest_id") REFERENCES "LabTest" ("id");

ALTER TABLE "LabTestReport" ADD FOREIGN KEY ("labtest_id") REFERENCES "LabTest_Parent" ("id");

--ALTER TABLE "LabComponentReport" ADD FOREIGN KEY ("labtestcomponent_id") REFERENCES "LabTestComponent" ("id");

ALTER TABLE "LabComponentReport" ADD FOREIGN KEY ("labtestcomponent_id") REFERENCES "LabTest_Child" ("id");

ALTER TABLE "LabComponentReport" ADD FOREIGN KEY ("labtestreport_id") REFERENCES "LabTestReport" ("id");

ALTER TABLE "LabUserTypePermissions" ADD FOREIGN KEY ("permission_id") REFERENCES "Permission1" ("id");

ALTER TABLE "LabsMembers" ADD FOREIGN KEY ("user_id") REFERENCES "CustomUser" ("id");

ALTER TABLE "LabsMembers" ADD FOREIGN KEY ("lab_id") REFERENCES "Lab" ("id");

ALTER TABLE "Protocol" ADD FOREIGN KEY ("lab_id") REFERENCES "Lab" ("id");

ALTER TABLE "Patient" ADD FOREIGN KEY ("healthcare_provider") REFERENCES "HealthcareProvider" ("id");

ALTER TABLE "Lab" ADD FOREIGN KEY ("id") REFERENCES "LabUserType" ("lab_id");

ALTER TABLE "LabUserTypePermissions" ADD FOREIGN KEY ("labusertype_id") REFERENCES "LabUserType" ("id");

ALTER TABLE "LabMemberPermissions" ADD FOREIGN KEY ("labmember_id") REFERENCES "LabsMembers" ("id");

ALTER TABLE "LabMemberPermissions" ADD FOREIGN KEY ("permission_id") REFERENCES "Permission2" ("id");

ALTER TABLE "LabUserType" ADD FOREIGN KEY ("id") REFERENCES "LabsMembers" ("type");
