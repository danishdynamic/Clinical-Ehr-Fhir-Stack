# Clinical EHR & FHIR Architecture Stack

An Educational Implementation of Healthcare Interoperability, Security, and Compliance Frameworks.

![alt text](fhirehr_gif.gif)
---

> ⚠️ **CRITICAL MEDICAL & LEGAL DISCLAIMER**
> This project is an **educational implementation** of Electronic Health Record (EHR) architectures, HL7 FHIR standards, openEHR modeling, and clinical security paradigms. While it incorporates technical safeguards aligned with HIPAA (Health Insurance Portability and Accountability Act) guidelines, **this software is neither certified nor guaranteed to be HIPAA compliant**. 
> 
> **DO NOT USE THIS SYSTEM WITH REAL PATIENT HEALTH INFORMATION (PHI) OR IN PRODUCTION CLINICAL ENVIRONMENTS.** Deployment with real patient data requires a comprehensive institutional compliance review, formal operational controls, administrative workflows, business associate agreements (BAAs), and legal infrastructure.

---

## 🌟 Overview

The **Clinical EHR & FHIR Architecture Stack** is an enterprise-grade blueprint designed to explore the intersection of modern web engineering and strict clinical data governance. It demonstrates how to build an interoperable, highly secure, and audit-defensible health informatics ecosystem using an **Asynchronous Django (ASGI)** backend paired with a type-safe **Next.js Single Page Application (SPA)**.

This project addresses the modern dilemma of healthcare software: balancing rapid, decoupled API-driven layout rendering with the immutable constraints of patient data privacy, role-restricted clinical isolation, and semantic diagnostic accuracy.

---

## 🏗️ Core Architectural Pillars

The architecture is systematically decoupled across six functional pillars:

### 1. HIPAA-Aligned Technical Safeguards
Engineered to emulate the technical safeguards required under **45 CFR § 164.312**:
* **Access Control:** Enforcing unique user identification, role-based resource scopes, and automatic front-to-back session termination policies.
* **Transmission Security:** Guarding against unauthorized modification of PHI during transit through strictly enforced HTTP header contexts, token-validation handshakes, and database transaction protection blocks.

### 2. FHIR Interoperability (HL7) & Data Portability
Implements native structures compliant with **Fast Healthcare Interoperability Resources (FHIR) Release 4/5**:
* **Resource Modeling:** Mapping object-relational schemas to standard FHIR JSON representations (e.g., `Patient`, `Observation`, `Encounter`).
* **B2B Interoperability Layer:** Designed to expose decoupled read-only FHIR serialization schemas. This allows third-party integrations—such as upcoming dedicated insurance risk underwriting and claims handling applications—to query authorized data points transparently without polluting the clinical model layer.

### 3. openEHR Modeling Concepts
Leverages the structural concepts popularized by openEHR:
* **Semantic Separation:** Keeping the underlying structural database schemas stable while shifting fluid clinical domain knowledge into configurable, logical entry representations.
* **Hierarchical Repositories:** Structuring query boundaries to manipulate deeply nested, sequential clinical entries (Compositions) without suffering from relational database schema rigidity.

### 4. Custom JWT & Frontend RBAC Sync
A zero-trust access network tailored for multi-tenant hospital environments:
* **Enhanced Token Payloads:** Extends default Django SimpleJWT mechanics via a customized token-obtain pipeline. Upon verification, the login endpoint actively ships user metadata (`role`, `email`, names) down inside the encrypted validation payload.
* **Granular Sidebar Filtering:** The Next.js frontend listens directly to this synchronized token lifecycle. It utilizes strict client-side verification to automatically compile individual navigational footprints based on user functional matrices (e.g., `ADMIN`, `DOCTOR`, `NURSE`, `AUDITOR`, `INSURER`).

### 5. Compliance & Security Audit Logging
An absolute, tamper-evident record of all system interactions:
* **Full Attribution:** Every read, write, or modification captures the precise *Who, What, When, Where, and Why* of PHI access.
* **ATNA Alignment:** Emulating Audit Trail and Node Authentication integration profiles, capturing database level transaction diffs linked directly to the initiating authenticated session context.

### 6. Robust Type-Safe Backend Engineering
* **Pylance-Compliant Type Guarding:** The API incorporates explicit `None` barrier guards and dynamic lookup routing (`getattr`) to eliminate static stub type-checking errors, combining pythonic flexibility with strict compile-time checks.
* **Optimized Persistence Engine:** Engineered to resolve complex relational deadlock states using clean transaction workflows, optimized indexing strategies, and optimized PostgreSQL execution paths.

---

## 📂 Project Structure

```text
Clinical-Ehr-Fhir-Stack/
├── backend/
│   ├── config/                  # Core project configuration entry point
│   │   ├── __init__.py
│   │   ├── asgi.py              # ASGI configuration for high-concurrency connections
│   │   ├── settings.py          # Security, SimpleJWT, and DB configuration profiles
│   │   ├── urls.py              # Global URL dispatching matrix (routes /auth/ to users app)
│   │   └── wsgi.py              # WSGI fallback server config
│   ├── apps/
│   │   ├── users/               # Custom User models, Custom JWT Token Generation, and RBAC views
│   │   ├── patients/            # Patient Demographics, FHIR serialization, and registry lookups
│   │   ├── observations/        # Clinical vitals, telemetry entries, and health timelines
│   │   └── audit_logs/          # Immutable compliance log capturing engines
│   ├── manage.py
│   └── requirements.txt
├── frontend/                    # Next.js Single Page Application
│   ├── app/                     # App router routing pages (dashboard, patients, etc.)
│   ├── components/
│   │   └── layout/
│   │       ├── AppShell.tsx     # Master client UI viewport structure
│   │       └── Sidebar.tsx      # Dynamic RBAC navigation list with integrated Sign Out handler
│   └── hooks/
│       └── useAuth.ts           # Token storage and reactive authentication profile controller
└── README.md
```

---

## 🚀 Installation & Local Environment Setup

### Backend (Django REST Framework)

- Clone the repository and navigate to the backend directory:

```Bash
cd Clinical-Ehr-Fhir-Stack/backend
```

- Initialize a python virtual environment and activate it:


```Bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

- Install the system dependencies:

```Bash
pip install -r requirements.txt
```

- Execute your local database migrations:

```Bash
python manage.py migrate
```

- Seed a terminal superuser account (Note: Ensure you assign roles inside the python shell afterward):

``` Bash
python manage.py createsuperuser
```

- Start up the development ASGI server:

```Bash
python manage.py runserver
Frontend (Next.js)
```

- Navigate to the frontend directory:

```Bash
cd ../frontend
```

- Install dependencies:

```Bash
npm install
```

- Fire up the local hot-reloading development server:

```Bash
npm run dev
```

- Clear your browser developer tools console cache (localStorage.clear()) on your first launch to reset any stale local mock sessions.