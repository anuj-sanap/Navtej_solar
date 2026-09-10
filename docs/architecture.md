x# Navtej Solar Tech Energy — Architecture

## 1. Architecture Principles
- Keep the system simple for the project scope.
- Separate presentation, business logic and data access.
- Prefer reusable modules over duplicated logic.
- Make calculator logic independently testable.
- Enforce authorization on the server, not only in the UI.

## 2. Recommended Stack
The implementation may use the existing project stack where practical. A recommended baseline is:
- Frontend: React/Next.js or the existing compatible frontend.
- Backend/API: Next.js server routes or Node.js/Express.
- Database: MongoDB.
- Authentication: secure session/token-based admin authentication.
- Charts: a maintained React-compatible chart library.
- Media: local development storage and production-ready image storage.
- Deployment: environment-based configuration.

Do not rewrite working modules without a clear technical reason.

## 3. High-Level Components
```text
Browser
  |
  +-- Public Website
  |      |
  |      +-- Pages / Components
  |      +-- Solar Calculator
  |      +-- Enquiry Forms
  |
  +-- Admin Dashboard
         |
         v
       API Layer
         |
   +-----+-------------------+
   |                         |
Auth / Validation      Domain Services
                             |
                     +-------+-------+
                     |               |
                  MongoDB        Media Storage
```

## 4. Suggested Module Structure
```text
src/
  app-or-pages/
  components/
    common/
    layout/
    calculator/
    forms/
    admin/
  features/
    enquiries/
    projects/
    calculator/
    auth/
  lib/
    api/
    validation/
    calculations/
    database/
    config/
  models/
  services/
  hooks/
  types/
  tests/
```

## 5. Data Model

### Enquiry
- id
- name
- phone
- email (optional where approved)
- pincode/location
- serviceInterest
- message
- calculatorData (optional snapshot)
- source
- status
- createdAt
- updatedAt

### Project
- id
- title
- slug
- category
- location
- description
- images
- featured
- createdAt
- updatedAt

### Admin User
- id
- name
- email/username
- passwordHash or external auth identity
- role
- createdAt
- updatedAt

## 6. API Design Principles
Use resource-oriented endpoints and consistent response shapes.

Examples:
- GET /api/projects
- POST /api/projects
- GET /api/projects/:id
- PATCH /api/projects/:id
- DELETE /api/projects/:id
- POST /api/enquiries
- GET /api/admin/enquiries
- PATCH /api/admin/enquiries/:id
- POST /api/auth/login
- POST /api/auth/logout

All write operations must validate input server-side.

## 7. Calculator Architecture
```text
Calculator UI
    |
Input Schema Validation
    |
Calculation Engine
    |
Result Object
    +-- Summary Metrics
    +-- Assumptions
    +-- Chart Data
    +-- Recommendation Data
```

Keep formulas in dedicated calculation modules. The UI must not contain duplicated business formulas.

## 8. Security
- Hash passwords; never store plaintext passwords.
- Use environment variables for secrets.
- Validate and sanitize untrusted input.
- Rate-limit or protect public forms where feasible.
- Require authentication and authorization for admin APIs.
- Restrict file type and size for uploads.
- Avoid exposing internal error details.

## 9. Reliability and Observability
- Structured error handling.
- User-friendly error messages.
- Logging without passwords, tokens or unnecessary personal data.
- Database indexes for common admin queries.
- Backup/restore strategy to be defined before production launch.

## 10. Deployment Environments
- Development: local configuration.
- Staging/preview: optional but preferred for approval.
- Production: separate environment variables and production database.
