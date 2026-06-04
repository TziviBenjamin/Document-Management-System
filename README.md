# Document Management & History System (Node.js & MongoDB)

A high-performance, type-safe backend service developed with **Node.js**, **TypeScript**, and **MongoDB**. This platform provides hierarchical, path-based document management alongside an immutable automated audit logging system for comprehensive lifecycle tracking.

##  Core Capabilities

* **Strict Type Safety:** Fully implemented in TypeScript with robust interface definitions and compile-time type checking.
* **Hierarchical Virtual File System:** Simulates complex directory and folder structures natively through optimized path-prefix string modeling and indexing.
* **Event-Driven Audit Trails:** Decoupled post-execution middleware that automatically intercepts data mutations (`CREATE`, `UPDATE`, `DELETE`) to record immutable history logs.
* **Dynamic PDF Compilation:** Server-side document rendering engine that compiles textual content into downloadable PDF binaries on the fly.
* **Contextual Authentication Middleware:** Custom stateless security layer that enforces user identity context propagation via the `X-User-Id` request header.
* **Granular Query Engine:** Advanced server-side capability supporting dynamic field sorting (ascending/descending), structural folder filtering, and paginated history slicing.

##  Technology Blueprint

* **Runtime & Framework:** Node.js / Express.js
* **Language:** TypeScript
* **Database & Modeling:** MongoDB / Mongoose Object Modeling
* **Data Validation:** Schema-based validation using Joi / Zod middleware
* **Architecture:** N-Tier Layered Pattern (Controller ➔ Service ➔ Data Access Object)

---

##  Architectural Deep Dive

### 1. N-Tier Layered Design
To ensure maximum maintainability and testability, the codebase adheres to a strict separation of concerns:
* **Presentation Layer (API/Routes):** Manages HTTP request parsing, status code serialization, and client communication.
* **Business Logic Layer (Services):** Orchestrates core domain logic, transaction flows, and service integrations.
* **Data Access Layer (DAL):** Encapsulates isolated database queries and schema mutations.

### 2. Aspect-Oriented Audit Logging
Rather than cluttering business services with repetitive logging routines, an automated interceptor middleware captures outbound HTTP responses post-success, extracts resource metadata, and commits a structured transaction log to the history ledger asynchronously.

---

##  Getting Started

### Prerequisites

* Node.js (v14+)
* MongoDB instance (Local or Atlas)

### Installation

1. **Clone the repo:**
<pre dir="ltr">git clone [your-repo-link]</pre>

2. **Install dependencies:**
<pre dir="ltr">npm install</pre>

3. **Set up your environment variables:** Create a .env file in the root directory:
<pre dir="ltr">PORT=3000
MONGO_URI=your_mongodb_connection_string</pre>

4. **Start the server:**
<pre dir="ltr">npm start</pre>
