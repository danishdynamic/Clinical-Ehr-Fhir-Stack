# Clinical EHR & FHIR Backend Engine

An asynchronous Django (ASGI) REST engine providing secure, HIPAA aligned clinical data handling, HL7 FHIR R4/R5 resource mapping, openEHR archetype composition, and granular Role Based Access Control (RBAC).

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Django ORM / DRF](https://img.shields.io/badge/DRF-3.14%2B-red?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT Auth](https://img.shields.io/badge/JWT-Custom_Claims-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![HL7 FHIR](https://img.shields.io/badge/HL7_FHIR-R4%2FR5-orange?style=for-the-badge)](https://hl7.org/fhir/)
[![openEHR](https://img.shields.io/badge/openEHR-Archetypes-teal?style=for-the-badge)](https://www.openehr.org/)

---

## ⚠️ Critical Medical & Legal Disclaimer

> This backend software is an educational blueprint designed to demonstrate health informatics engineering, HL7 FHIR serialization, and clinical data governance concepts.

- No Production Certification: This engine is not certified under HIPAA, HITECH, or ONC guidelines.

- Prohibited Data: DO NOT process, store, or transmit real Protected Health Information (PHI) or Personally Identifiable Information (PII) through this system.

- Deployment Constraints: Deployment in clinical production requires formal institutional review, Business Associate Agreements (BAAs), verified key management infrastructure, and legal compliance sign off.

---

## 📐 Architecture & System Flow
The backend handles client requests via an asynchronous pipeline. Custom JWT payloads embed RBAC roles, which Django REST Framework (DRF) permission classes and ATNA aligned audit middleware validate before dispatching to specific domain apps.

```mermaid
graph TD
    Client[Next.js Client / B2B Consumer] -->|HTTP / WSS Request + JWT| ASGI[ASGI Gateway / Uvicorn]
    ASGI --> AuthMiddleware[Custom JWT Auth & RBAC Verification]
    
    subgraph Core Engine Middleware
        AuthMiddleware --> AuditSignal[ATNA Audit Logger]
        AuthMiddleware --> Router[URL Dispatcher]
    end

    Router -->|/api/v1/users/| UsersApp[apps.users]
    Router -->|/api/v1/patients/| PatientsApp[apps.patients]
    Router -->|/api/v1/observations/| ObsApp[apps.observations]
    Router -->|/api/v1/compositions/| CompApp[apps.compositions]
    Router -->|/api/v1/openehr/| OpenEHRApp[apps.openehr]
    Router -->|/api/v1/clinical-rules/| RulesApp[apps.clinical_rules]
    Router -->|/api/v1/fhir/| FHIRApp[apps.fhir]
    Router -->|/api/v1/audit-logs/| AuditApp[apps.audit_logs]

    subgraph Dual-Model Data Engine
        PatientsApp & ObsApp --> Database[(PostgreSQL DB)]
        OpenEHRApp & CompApp --> ArchetypeStore[(openEHR Archetype Repository)]
        FHIRApp -->|Read-Only Transformation| FHIRSerializer[HL7 FHIR R4/R5 Serializer]
    end

    AuditSignal -->|Write-Once Append| AuditStore[(Immutable Audit Logs)]
```
---

## Dual Model Clinical Transformation Pipeline

To resolve relational schema rigidity while maintaining FHIR interoperability, clinical data flows through a dual model abstraction layer:

```mermaid
sequenceDiagram
    autonumber
    participant Client as Frontend / Interop Client
    participant DRF as DRF View / API Endpoint
    participant Relational as Relational Core (Patients/Observations)
    participant openEHR as openEHR Archetype Engine
    participant FHIR as FHIR R4/R5 Serializer

    Client->>DRF: POST /api/v1/observations/ (Clinical Vital Entry)
    DRF->>Relational: Persist normalized record to PostgreSQL
    Relational->>openEHR: Map attributes to Archetype Entry (Composition)
    openEHR-->>DRF: Validate against openEHR Schema Template
    DRF-->>Client: 201 Created (Relational Payload)

    Note over Client, FHIR: Subsequent B2B Interoperability Query
    Client->>DRF: GET /api/v1/fhir/Observation/{id}
    DRF->>FHIR: Fetch Relational + openEHR context
    FHIR->>FHIR: Transform to standardized FHIR R4 JSON schema
    FHIR-->>Client: 200 OK (FHIR Resource Document)
```
---

## Sub-App Domain Architecture

The logic is partitioned into eight specialized application packages inside backend/apps/ 

| Sub App Directory | Core Responsibility | Key Models / Entities | Standards / Compliance |
|------------------|--------------------|----------------------|------------------------|
| apps/users | Extends default authentication pipelines, issues JWTs with custom claim payloads (role, email, full name), and enforces RBAC access matrices | CustomUser, UserRole, SecurityProfile | HIPAA §164.312(a)(1) Access Control
| apps/patients | Manages demographic records, Master Patient Index (MPI) lookups, regional/national identification tokens, and emergency contact associations. | Patient, PatientIdentifier, Demographics | HL7 FHIR Patient Resource
| apps/observations | Stores clinical measurements, lab results, vital sign telemetry, and chronological health metrics with precise unit bindings. | Observation, VitalSign, TelemetryEntry | LOINC, UCUM, HL7 FHIR Observation
| apps/compositions | Handles structured clinical document entries (Compositions), clinical encounter notes, discharge summaries, and historical health records. | Composition, EncounterNote, ClinicalDocument | openEHR Composition Archetypes
| apps/openehr | Implements openEHR archetype definition bindings, separating fluid domain knowledge structures from the rigid relational schema. | Archetype, Template, ClinicalEntry | openEHR Architecture Standards
| apps/clinical_rules | Executes Clinical Decision Support (CDS) logic, flags out-of-bound vital measurements, and generates real-time clinical alerts. | ClinicalRule, AlertRule, RuleExecutionLog | CDS Hooks / Evidence-Based Protocol
| apps/fhir | Provides a decoupled B2B read/write serialization layer mapping internal models directly to HL7 FHIR R4/R5 JSON specifications. | FHIRMapping, ResourceTransformer | HL7 FHIR R4 / R5 Framework
| apps/audit_logs | Intercepts read/write operations on PHI to create an immutable, append-only record tracking Who, What, When, Where, and Why. | AuditTrailLog, AccessEvent, SystemDiff | ATNA Profile / HIPAA §164.312(b) Audit

---

## Security & Compliance Mechanics

1. Custom JWT & RBAC Payload Injection
The ```apps/users``` application overrides ```TokenObtainPairView``` to inject authorization claims into the signed token payload. This eliminates unnecessary authorization queries on downstream API calls and synchronizes RBAC logic with the client application.

```json
{
  "token_type": "access",
  "exp": 1770000000,
  "iat": 1769913600,
  "jti": "a9b8c7d6e5f41234567890abcdef",
  "user_id": 42,
  "email": "dr.smith@hospital.org",
  "role": "DOCTOR",
  "first_name": "Sarah",
  "last_name": "Smith",
  "permissions": ["patients:read", "patients:write", "observations:write"]
}
```

### Enforced Role Matrix

- **ADMIN**: System wide configuration, audit monitoring, user lifecycle management.

- **DOCTOR**: Full read/write access to assigned patient records, observations, and compositions.

- **NURSE**: Read access to patient demographics; write access to vitals, telemetry, and observations.

- **AUDITOR**: Read only access to tamper evident audit trails and compliance reports.

- **INSURER**: Restricted access to sanitized, read only FHIR serialization resources for claim processing.


2. Audit Trail and Node Authentication (ATNA)
   
The ```apps/audit_logs``` engine hooks into Django signals and custom middleware to log every data interaction involving PHI before database transactions complete:

- Capture Context: Timestamp, Initiating User ID, Assigned Role, Source IP, Request Method, Endpoint Route.

- Payload Diff: Captures pre modification vs. post modification JSON deltas.

- Immutability: Log entries are strictly append only; ```DELETE``` and ```UPDATE``` operations are blocked at the ORM level for audit records.


---

## Repository Directory Structure

```text
Clinical-Ehr-Fhir-Stack/
backend/
├── apps/
│   ├── audit_logs/          # ATNA-aligned security audit logging engine
│   │   ├── migrations/
│   │   ├── models.py        # AuditLog, AccessEvent
│   │   ├── middleware.py    # Request-level PHI interceptor
│   │   ├── views.py
│   │   └── urls.py
│   ├── clinical_rules/      # CDS engine and vital alert thresholds
│   │   ├── evaluator.py     # Rule processing engine
│   │   ├── models.py        # Rule definitions
│   │   └── views.py
│   ├── compositions/        # openEHR clinical entry compositions
│   │   ├── models.py        # Composition records
│   │   └── serializers.py
│   ├── fhir/                # HL7 FHIR R4/R5 transformation layer
│   │   ├── mapping/         # Custom Python serializers for FHIR JSON
│   │   ├── models.py
│   │   └── views.py         # /api/v1/fhir/ endpoints
│   ├── observations/        # Vitals, labs, and clinical telemetry
│   │   ├── models.py        # Observation metrics
│   │   └── views.py
│   ├── openehr/             # Archetypes and template modeling structures
│   │   ├── archetypes/      # JSON/XML archetype schemas
│   │   └── models.py
│   ├── patients/            # Master Patient Index & demographic records
│   │   ├── models.py        # Patient model & IDs
│   │   └── views.py
│   └── users/               # Custom User, JWT customization, and RBAC
│       ├── models.py        # CustomUser, Roles
│       ├── tokens.py        # SimpleJWT payload overrides
│       └── views.py
├── config/                  # Core Django project configuration
│   ├── asgi.py              # Asynchronous gateway configuration
│   ├── settings.py          # Security headers, SimpleJWT, DB settings
│   ├── urls.py              # Core URL routing dispatcher
│   └── wsgi.py              # WSGI fallback entry
├── manage.py
└── requirements.txt

```
---

## API Endpoints Overview

All endpoints (except auth token issues) require a valid Bearer ``` <Token>``` in the Authorization ```header```.

| Method | Endpoint | Description | Allowed Roles |
|--------|----------|-------------|----------------|
POST | /api/v1/users/auth/token/ |Authenticate user & issue token pair with claims| Public
POST | /api/v1/users/auth/token/refresh/ |Refresh expired access token| Public
GET | /api/v1/patients/ |Search Master Patient Index| ADMIN, DOCTOR, NURSE
POST | /api/v1/patients/ |Register new patient record| ADMIN, DOCTOR
GET | /api/v1/observations/ |Fetch historical health/vital telemetry| ADMIN, DOCTOR, NURSE
POST | /api/v1/observations/ |Submit new vital sign or lab observation| DOCTOR, NURSE
GET | /api/v1/compositions/ |Query openEHR clinical document entries| ADMIN, DOCTOR
GET | /api/v1/fhir/Patient/{id} |Export Patient record in FHIR R4 JSON format| All Authenticated Roles
GET | /api/v1/fhir/Observation/{id} |Export Observation record in FHIR R4 JSON| All Authenticated Roles
GET | /api/v1/audit-logs/ |Query append-only access and compliance logs| ADMIN, AUDITOR

--- 

## Local Environment Setup

1. Prerequisites
- Python 3.11+

- PostgreSQL 14+ (or SQLite for local mock testing)

2. Step by Step Setup
- Navigate to the ```backend/``` directory:

```Bash
cd backend
```

Initialize and activate a virtual environment:

```Bash
# macOS / Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

Install backend dependencies:

```Bash
pip install --upgrade pip
pip install -r requirements.txt
```

Set environment variables (or create a .env file in backend/config/):

```Bash
export SECRET_KEY="your-development-secret-key"
export DEBUG="True"
export DATABASE_URL="postgres://user:password@localhost:5432/ehr_db"
```

Run migrations to create the system tables:

```Bash
python manage.py migrate
```

Create a terminal administrator user:

```Bash
python manage.py createsuperuser
```

Start the ASGI development server using Uvicorn:

```Bash
python manage.py runserver
```

- The API engine will be accessible at [http://127.0.0.1:8000/](http://127.0.0.1:8000/). 

- You can view the openAPI documentation at [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/) if enabled.
